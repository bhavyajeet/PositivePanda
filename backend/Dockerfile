FROM python:3.8-slim

COPY requirements.txt /opt/requirements.txt
RUN pip install gunicorn -r /opt/requirements.txt

COPY . /opt

ENV PYTHONPATH /opt
WORKDIR /opt

CMD ["gunicorn", "--access-logfile", "-", "-b", "0.0.0.0:5000", "articles_api.app:app"]
