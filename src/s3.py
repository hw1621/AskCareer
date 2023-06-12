import boto3

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

default_image_string = "https://drp26profilephotos.s3.eu-west-2.amazonaws.com/profile-icon-design-free-vector.jpg"
bucket_url = "https://drp26profilephotos.s3.eu-west-2.amazonaws.com/"


def save_to_s3(file, bucket_name, key):
    try:
        file.seek(0)
        client.put_object(
            Body=file.read(),
            Bucket=bucket_name,
            Key=key,
            ACL='public-read'
        )
    except Exception as e:
        print("Exception thrown: ", e)
        return e
    return bucket_url + file.filename


if __name__ == "__main__":
    clientResponse = client.list_buckets()
    print('Printing bucket names...')
    for bucket in clientResponse['Buckets']:
        print(f'Bucket Name: {bucket["Name"]}')
