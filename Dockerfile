FROM public.ecr.aws/lambda/nodejs:12

COPY src/lambda/lambda-test.js ${LAMBDA_TASK_ROOT}

CMD ["lambda-test.handler"]