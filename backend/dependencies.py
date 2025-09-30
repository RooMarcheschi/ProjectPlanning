from bonita_client import BonitaClient


def get_bonita_client():
    bonita = BonitaClient(
        # http://host.docker.internal:8080 o "http://localhost:8080"
        base_url="http://host.docker.internal:8080",
        username="walter.bates",
        password="bpm",
    )
    return bonita
