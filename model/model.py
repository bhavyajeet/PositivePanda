import os
import zipfile

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import requests
import tensorflow as tf
from transformers import BertTokenizer, TFBertForSequenceClassification


class Model:
    def __init__(self, model_path="./modelSentiment", tokenizer="bert-base-uncased"):
        """
        Initialize model

        Downloads the model if not present
        """
        if os.path.exists(model_path):
            self.model = TFBertForSequenceClassification.from_pretrained(model_path)
        else:
            print("Downloading model...")
            Model.download_file_from_google_drive(
                "1uthnEb7WYnIR6y0VVX4gMPoqG-X0oKRK", "Modelfile.zip"
            )

            with zipfile.ZipFile("Modelfile.zip", "r") as zip_ref:
                zip_ref.extractall("./")

            self.model = TFBertForSequenceClassification.from_pretrained(model_path)

        self.tokenizer = BertTokenizer.from_pretrained(tokenizer)

    def predict(self, sentences):
        """
        Returns predictions about text sentiment

        0 - bad
        1 - good
        """
        tf_batch = self.tokenizer(
            sentences,
            max_length=64,
            padding=True,
            truncation=True,
            return_tensors="tf",
        )
        tf_outputs = self.model(tf_batch)
        tf_predictions = tf.nn.softmax(tf_outputs[0], axis=-1)
        label = tf.argmax(tf_predictions, axis=1)
        return label.numpy()

    @staticmethod
    def download_file_from_google_drive(id, destination):
        URL = "https://docs.google.com/uc?export=download"

        session = requests.Session()

        response = session.get(URL, params={"id": id}, stream=True)
        token = Model.get_confirm_token(response)

        if token:
            params = {"id": id, "confirm": token}
            response = session.get(URL, params=params, stream=True)

        Model.save_response_content(response, destination)

    @staticmethod
    def get_confirm_token(response):
        for key, value in response.cookies.items():
            if key.startswith("download_warning"):
                return value

        return None

    @staticmethod
    def save_response_content(response, destination):
        CHUNK_SIZE = 32768

        with open(destination, "wb") as f:
            for chunk in response.iter_content(CHUNK_SIZE):
                if chunk:  # filter out keep-alive new chunks
                    f.write(chunk)
