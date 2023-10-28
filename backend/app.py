from flask import Flask, request, jsonify
from minio import Minio
from minio.error import S3Error
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Minio server connection details
minio_endpoint = "127.0.0.1:9000"
access_key = "tanmayi"
secret_key = "tanmayi@123"
secure = False

# Create a Minio client
minio_client = Minio(minio_endpoint, access_key=access_key, secret_key=secret_key, secure=secure)

# Specify the bucket name
bucket_name = "tanmayi"

# Ensure the bucket exists, create it if it doesn't
if not minio_client.bucket_exists(bucket_name):
    minio_client.make_bucket(bucket_name)
    print(f"Bucket '{bucket_name}' has been created")

@app.route('/upload', methods=['POST'])
def upload_photo():
    try:
        uploaded_file = request.files['photo']
        if uploaded_file:
            # Specify the object name (key) under which the photo will be stored in the bucket
            object_name = uploaded_file.filename

            # Upload the photo to the bucket
            minio_client.put_object(bucket_name, object_name, uploaded_file, length=uploaded_file.content_length, content_type=uploaded_file.content_type)
            return jsonify({"message": f"Uploaded '{object_name}' to bucket '{bucket_name}'"})

        return jsonify({"error": "No file uploaded."})

    except S3Error as e:
        # Print the detailed error message for debugging purposes
        print(f"An error occurred while uploading: {e}")
        return jsonify({"error": f"An error occurred while uploading: {e}"})
    except Exception as e:
        # Handle other exceptions
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred."})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
