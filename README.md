directory-to-s3
===============

A CLI to simply upload a directory to Amazon S3.

## Usage

```
Usage:
  directory-to-s3 [options ...] <bucket>

Options:
  -d --directory=DIR      A directory which will be recursively uploaded [default: ./]
  -p --pattern=PATTERN    A glob pattern which will be uploaded
  -P --prefix=PREFIX      An optional prefix to prepend to each file key
  -r --region=REGION      The AWS region the bucket is hosted on [default: us-east-1]
  -a --acl=ACL            The ACL to assign to the uploaded files [default: public-read]
  -v --verbose            Print progress logs to STDOUT [default: false]
  -s --silent             Print no logs ever [default: false]
  -h --help               Show this usage
  --version               Show the version
```

## Examples

Upload the current directory to your bucket:

```
$ directory-to-s3 my-bucket
```


Upload another directory to your bucket:

```
$ directory-to-s3 -d public my-bucket
```


Upload two directories to your bucket:

```
$ directory-to-s3 -d public -d tmp my-bucket
```


Upload files matching a pattern to your bucket:

```
$ directory-to-s3 -p public/**/*.js my-bucket
```


Upload files matching a pattern to your bucket with a key-prefix:

```
$ directory-to-s3 -p public/**/*.js -P scripts/ my-bucket
```

## Install

```
$ npm install -g directory-to-s3
```

Or to use it in a node project it can be installed locally:

```
$ npm install -D directory-to-s3
```

And then add a `deploy` [npm script](https://docs.npmjs.com/misc/scripts) like this:

```
{
  ...
  "scripts": {
    "deploy": "directory-to-s3 -p public/ project-bucket"
  }
  ...
}
```

## AWS Credentials

To use `directory-to-s3` it needs some [AWS credentials](http://docs.aws.amazon.com/general/latest/gr/aws-security-credentials.html). And since the [AWS SDK already provides this in a multitude of ways](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Setting_AWS_Credentials) it's not part of this tool.

But two common ways to provide credentials are:

1. Environment variables

    ```
    $ AWS_ACCESS_KEY_ID=111 AWS_SECRET_ACCESS_KEY=222 directory-to-s3 my-bucket
    ```

2. A credentials file

    ```
    # ~/.aws/credentials
    [default]
    aws_access_key_id = 111
    aws_secret_access_key = 222

    [project-x]
    aws_access_key_id = 333
    aws_secret_access_key = 444
    ```

    ```
    $ directory-to-s3 my-default-bucket
    $ AWS_PROFILE=project-x directory-to-s3 my-project-x-bucket
    ```
