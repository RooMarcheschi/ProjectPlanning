import requests


class BonitaClient:
    def __init__(self, base_url: str, username: str, password: str):
        self.base_url = base_url.rstrip("/")
        self.username = username
        self.password = password
        self.session = requests.Session()
        self._login()
        self.session.headers.update(
            {
                "X-Bonita-API-Token": self.session.cookies.get("X-Bonita-API-Token"),
                "Content-Type": "application/json",
            }
        )

    def _login(self):
        """Login a Bonita y guarda cookies en la sesión."""
        url = f"{self.base_url}/bonita/loginservice"
        data = {
            "username": self.username,
            "password": self.password,
            "redirect": "false",
        }
        resp = self.session.post(url, data=data)
        if resp.status_code not in [200, 204]:
            raise Exception(f"Error login Bonita: {resp.status_code} {resp.text}")

    def start_process(self, process_definition_id: str, variables: dict = None):
        """Inicia un proceso dado su process_definition_id con variables opcionales"""
        url = f"{self.base_url}/bonita/API/bpm/process/{process_definition_id}/instantiation"
        payload = {
            "variables": [{"name": k, "value": v} for k, v in (variables or {}).items()]
        }
        resp = self.session.post(url, json=payload)
        if resp.status_code not in [200, 201]:
            raise Exception(f"Error al iniciar proceso: {resp.status_code} {resp.text}")
        return resp.json()

    def get_process_id_by_name(self, process_name: str):
        """Busca un proceso por su nombre y devuelve el processDefinitionId"""
        url = f"{self.base_url}/bonita/API/bpm/process"
        params = {"f": f"name={process_name}"}
        resp = self.session.get(url, params=params)
        if resp.status_code != 200:
            raise Exception(f"Error buscando proceso: {resp.status_code} {resp.text}")

        processes = resp.json()
        if not processes:
            raise Exception(f"No se encontró ningún proceso con nombre {process_name}")

        # Retorna el primer match
        return processes[0]["id"]
