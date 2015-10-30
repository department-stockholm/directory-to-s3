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

