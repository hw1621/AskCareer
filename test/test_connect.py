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


def test_post_job_succeeds(client):
    data = {
        "job-title": "Software Engineer Intern",
        "company": "Google",
        "jd": "I work here"
    }
    rv = client.post('/', data=data)
    assert rv.status_code == 200


def test_post_without_data_fails(client):
    rv = client.post('/')
    assert rv.status_code == 500

