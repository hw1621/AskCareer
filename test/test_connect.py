import pytest

import src.app as api


@pytest.fixture
def client():
    api.app.config['TESTING'] = True
    with api.app.test_client() as client:
        yield client


def test_connect(client):
    rv = client.get('/')
    assert rv.status_code == 200
