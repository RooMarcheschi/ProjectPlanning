import requests


class BonitaClient:
    """Cliente para interactuar con la API de Bonita"""

    def __init__(self, base_url: str, username: str, password: str):
        """Inicializa el cliente, realiza login y guarda cookies en la sesión."""
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
        """Login a Bonita."""
        url = f"{self.base_url}/bonita/loginservice"
        data = {
            "username": self.username,
            "password": self.password,
            "redirect": "false",
        }
        resp = self.session.post(url, data=data)
        if resp.status_code not in [200, 204]:
            raise Exception(f"Error login Bonita: {resp.status_code} {resp.text}")

    def start_process(self, process_definition_id: str):
        """Inicia un proceso dado su process_definition_id con variables opcionales"""
        url = f"{self.base_url}/bonita/API/bpm/process/{process_definition_id}/instantiation"
        resp = self.session.post(url)
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

    def set_case_variable(
        self,
        case_id: str,
        variable_name: str,
        value,
        type_hint: str = None,
        debug: bool = False,
    ):
        """
        Actualiza el valor de una variable en un case existente.
        - case_id: ID del case
        - variable_name: nombre de la variable (sensible a mayúsculas según el diseño del proceso)
        - value: valor a setear (se convierte a string)
        - type_hint: tipo Java opcional ("java.lang.Integer", "java.lang.String", etc.)
          Si no se pasa, se infiere a partir del tipo Python.
        """

        TYPE_MAP = {
            int: "java.lang.Integer",
            float: "java.lang.Double",
            bool: "java.lang.Boolean",
            str: "java.lang.String",
        }

        if type_hint is None:
            type_hint = TYPE_MAP.get(type(value), "java.lang.String")

        payload = {"value": str(value) if value is not None else "", "type": type_hint}

        url = f"{self.base_url}/bonita/API/bpm/caseVariable/{case_id}/{variable_name}"

        if debug:
            print(f"PUT {url}")
            print("Payload:", payload)

        resp = self.session.put(url, json=payload)
        if resp.status_code not in [200, 204]:
            raise Exception(
                f"Error al actualizar variable: {resp.status_code} {resp.text}"
            )

        # si devuelve json, lo retornamos, si no, devolvemos True
        try:
            return resp.json()
        except Exception:
            return True
