#/usr/bin/fish

# Example command: make delete-s3-bucket BUCKET=lazari-ways-bucket2
delete-s3-bucket:
	@echo "Deleting S3 bucket: $(BUCKET) in region: eu-central-1"
	@aws s3api delete-bucket --bucket $(BUCKET) --region "eu-central-1"