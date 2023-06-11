import boto3
from boto3 import s3

client = boto3.client(
    's3',
    aws_access_key_id='AKIAQXS56FU5AWVPF6UW',
    aws_secret_access_key='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',
    region_name='eu-west-2'
)

resource = boto3.resource(
    's3',
    aws_access_key_id='AKIAQXS56FU5AWVPF6UW',
    aws_secret_access_key='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',
    region_name='eu-west-2'
)


def save_to_s3(file, bucket_name, acl="public-read"):
    try:
        client.upload_fileobj(
            file,
            bucket_name,
            file.filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )
    except Exception as e:
        print("Exception thrown: ", e)
        return e
    return "save successful"


if __name__ == "__main__":
    clientResponse = client.list_buckets()
    print('Printing bucket names...')
    for bucket in clientResponse['Buckets']:
        print(f'Bucket Name: {bucket["Name"]}')
