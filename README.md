# Fuseble-CLI

## Template

```shell
npx fuseble-cli template \
--stack=react \
--template=next \
--name=fuseble-template \
--branch=main
```

## OpenAPI

```shell
# create requests
npx fuseble-cli openapi --url=http://localhost:8000/api-json --service

# create model types
npx fuseble-cli openapi --url=http://localhost:8000/api-json --schema

# create react-hooks with react-query
npx fuseble-cli openapi --react-hook --url=http://localhost:8000/api-json
npx fuseble-cli openapi --react-hook --url=http://localhost:8000/api-json --filter-tag=Auth # with OpenAPI Tag Filter
npx fuseble-cli openapi --react-hook --url=http://localhost:8000/api-json --filter-path=/admin # with OpenAPI Path Filter
```

## Prisma

```shell
npx fuseble-cli prisma --path=prisma/modules
```

## Terraform

### EC2 ALB

```shell
npx fuseble-cli terraform \
--template=ec2-alb \
--name=ec2-alb \
--key-name=root \
--region=ap-northeast-2 \
--root-domain=outqource.com \
--record=test.outqource.com \
--instance-count=1 \
--instance-type=t3.micro \
--vpc-cidr=10.0.0.0/16 \
--origin-http='' \
--origin-https=3010 \
--redirect-http=3010-3000
```

### ECS Fargate

```shell
npx fuseble-cli terraform \
--template=ecs-fargate \
--profile=default \
--region=ap-northeast-2 \
--service=my-service \
--ecr=my-service \
--root-domain=test.com \
--record-domain=test.test.com \
--port=8000 \
--database-port=3306 \
--vpc-cidr=10.0.0.0/16 \
--instance-count=2 \
--availability-zone=ap-northeast-2a,ap-northeast-2b \
--min-capacity=1 \
--max-capacity=2 \
--instance-cpu=1024 \
--instance-memory=2048 \
--container-cpu=512 \
--container-memory=1024
```

### S3 Web

```shell
npx fuseble-cli terraform \
--template=s3-web \
--profile=default \
--region=ap-northeast-2 \
--bucket=my-bucket \
--root-domain=test.com \
--record-domain=test.test.com
--cloudfront-comment="My CloudFront"
```
