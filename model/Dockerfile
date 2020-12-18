FROM python:3.8-slim

COPY requirements.txt /opt/requirements.txt
RUN pip install -r /opt/requirements.txt

COPY . /opt

ENV PYTHONPATH /opt
WORKDIR /opt

CMD ["python", "-u", "news.py"]
