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


def save_to_s3(file, bucket_name):
    try:
        file.seek(0)
        client.put_object(
            Body=file.read(),
            Bucket=bucket_name,
            Key=file.filename,
            ACL='public-read'
        )
    except Exception as e:
        print("Exception thrown: ", e)
        return e
    return "https://drp26profilephotos.s3.eu-west-2.amazonaws.com/" + file.filename


if __name__ == "__main__":
    clientResponse = client.list_buckets()
    print('Printing bucket names...')
    for bucket in clientResponse['Buckets']:
        print(f'Bucket Name: {bucket["Name"]}')
