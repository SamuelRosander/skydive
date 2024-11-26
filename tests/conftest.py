import pytest
from skydive import create_app


@pytest.fixture()
def app():
    app = create_app({
        "TESTING": True,
        "SECRET_KEY": "testing",
        "SQLALCHEMY_DATABASE_URI": "sqlite://",
        "WTF_CSRF_ENABLED": False,
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        "VIDEO_FOLDER": "/videos"
    })
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()
