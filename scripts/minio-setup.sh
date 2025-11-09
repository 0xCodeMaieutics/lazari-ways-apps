#!/usr/bin/env sh
set -e

mc alias set local "$MINIO_HOST" minioadmin minioadmin

echo "Creating bucket..."
mc mb local/protocols --with-lock

echo "Creating service account..."
mc admin user svcacct add local/ minioadmin \
  --access-key MINIO_ACCESS_KEY \
  --secret-key MINIO_SECRET_KEY

echo "MinIO setup complete!"
