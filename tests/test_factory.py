from skydive import create_app


def test_config():
    assert not create_app().testing
    assert create_app({'TESTING': True,
                       "SQLALCHEMY_DATABASE_URI": "sqlite://"}).testing


def test_home(client):
    response = client.get("/")

    assert response.status_code == 200, "Status code not 200"
    assert b"<title>Skydiving" in response.data, "Incorrect page title"
