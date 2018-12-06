[![Build Status](https://img.shields.io/travis/emdgroup/pipeline-approval/master.svg?style=flat-square)](https://travis-ci.org/emdgroup/pipeline-approval) [![GitHub license](https://img.shields.io/github/license/emdgroup/pipeline-approval.svg?style=flat-square)](https://github.com/emdgroup/pipeline-approval/blob/master/LICENSE) [![sponsored by](https://img.shields.io/badge/sponsored%20by-emdgroup.com-ff55aa.svg?style=flat-square)](http://emdgroup.com)

Drop-in replacement for the manual approval step that CodePipeline provides.

* Auto-approves if no changes have been identified
* Generates temporary URL to approval web site that doesn't require AWS Console login (great for approving from mobile)
* Summarizes changes to multiple stacks on a single page
  * Presents `diff` of current to new template
  * All macros and transforms will be resolved at this stage
  * Highlights changes in parameter values
  * Displays full CloudFormation ChangeSet information
* Approvals can require multiple approvers

**Step 1: Implement ChangeSets in Pipeline**

The approval step relies on the ChangeSet to compile and render the approval page. Make sure that your CodePipeline already creates CloudFormation ChangeSets for each stack deployment.

<details>
  <summary>Show Example Pipeline Stage</summary>

  Full example with explanations can be found [here](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-basic-walkthrough.html).

  ```yaml
  - Name: ProdStage
    Actions:
    - Name: CreateChangeSet
      ActionTypeId:
        Category: Deploy
        Owner: AWS
        Provider: CloudFormation
        Version: '1'
      InputArtifacts:
        - Name: TemplateSource
      Configuration:
        ActionMode: CHANGE_SET_REPLACE
        RoleArn: !GetAtt [CFNRole, Arn]
        StackName: !Ref ProdStackName
        ChangeSetName: !Ref ChangeSetName
        TemplateConfiguration: !Sub "TemplateSource::${ProdStackConfig}"
        TemplatePath: !Sub "TemplateSource::${TemplateFileName}"
      RunOrder: '1'
    - Name: ApproveChangeSet
      ActionTypeId:
        Category: Approval
        Owner: AWS
        Provider: Manual
        Version: '1'
      Configuration:
        NotificationArn: !Ref CodePipelineSNSTopic
        CustomData: !Sub 'A new change set was created for the ${ProdStackName} stack. Do you want to implement the changes?'
      RunOrder: '2'
    - Name: ExecuteChangeSet
      ActionTypeId:
        Category: Deploy
        Owner: AWS
        Provider: CloudFormation
        Version: '1'
      Configuration:
        ActionMode: CHANGE_SET_EXECUTE
        ChangeSetName: !Ref ChangeSetName
        RoleArn: !GetAtt [CFNRole, Arn]
        StackName: !Ref ProdStackName
      RunOrder: '3'
  ```

</details>

**Step 2: Create SNS Topic**

Skip this step if you already have a topic.

```sh
# replace AWS_REGION and AWS_ACCOUNT_ID accordingly
aws sns create-topic --name approval-notifications

# Subscribe with an email address
aws sns subscribe --topic-arn arn:aws:sns:$AWS_REGION:$AWS_ACCOUNT_ID:approval-notifications --protocol email --endpoint-url your@email.com
```

**Step 3: Launch Stack**

Via Console

[![Launch Stack](https://cdn.rawgit.com/buildkite/cloudformation-launch-stack-button-svg/master/launch-stack.svg)](https://console.aws.amazon.com/cloudformation/home#/stacks/quickcreate?templateUrl=https%3A%2F%2Fs3.amazonaws.com%2Fpipeline-approval-us-east-1%2Frelease%2Fv1.0.0%2Flambda.template.yml&stackName=approval-lambda)

or via CLI

```sh
aws cloudformation create-stack --template-url https://s3.amazonaws.com/pipeline-approval-us-east-1/release/v1.0.0/lambda.template.yml --capabilities CAPABILITY_IAM --stack-name approval-lambda
```

The Lambda function deployed by this stack can be shared by any number of pipelines in the same region.

If you prefer to build and host the CloudFormation template and Lambda code bundle yourself, head over to [pipeline-approval-lambda](https://github.com/emdgroup/pipeline-approval-lambda) and fork away.

**Step 4: Add Permissions to Pipeline Role**

This policy statement is required to provde the necessary permissions to the pipeline to call the approval lambda function.

```yaml
- Effect: Allow
  Action:
    - lambda:ListFunctions
    - lambda:InvokeFunction
  Resource: '*'
```

**Step 5: Replace Manual Approval Step with Lambda**

```yaml
- Name: ApproveChangeSet
  ActionTypeId:
    Category: Invoke
    Owner: AWS
    Version: 1
    Provider: Lambda
  Configuration:
    FunctionName: !ImportValue approval-lambda:FunctionArn
    # UserParameters needs to be string so we wrap it in a !Sub to be able to
    # reference parameters.
    UserParameters: !Sub |
      Stacks:
        - ${ProdStackName}
      TopicArn: arn:aws:sns:${AWS::Region}:${AWS::AccountId}:approval-notifications
  RunOrder: 2
```
