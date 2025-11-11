import requests
import time

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
    ):
        """
        Actualiza el valor de una variable en un case existente.
        - case_id: ID del case
        - variable_name: nombre de la variable
        - value: valor a setear
        - type_hint: tipo Java opcional ("java.lang.Integer", "java.lang.String", etc.)
        Si no se pasa, se infiere a partir del tipo Python.
        """
        # Mapeo del tipo de python al tipo de java
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
        
    
    def complete_activity(self, task_id: str):
        """
        Completa una actividad de usuario (userTask) dado su ID.
        Corresponde al endpoint: POST /API/bpm/userTask/{taskId}/execution
        """
        url = f"{self.base_url}/bonita/API/bpm/userTask/{task_id}/execution"
        
        # Hacemos un POST, usualmente sin payload, para ejecutar la tarea
        # Si necesitaras pasar variables al completar, usarías: json={"variable": "valor"}
        resp = self.session.post(url, json={})

        # Los códigos de éxito comunes para esto son 200 (OK) o 204 (No Content)
        if resp.status_code not in [200, 204]:
            raise Exception(
                f"Error al completar la actividad {task_id}: {resp.status_code} {resp.text}"
            )

        # Intentamos devolver la respuesta JSON si existe, sino True para éxito (en caso de 204)
        try:
            return resp.json()
        except requests.exceptions.JSONDecodeError:
            # Esto es normal si la respuesta es 204 No Content
            return True
        
    def assign_task(self, task_id: str, user_id: str):
        """
        Asigna una tarea de usuario (userTask) a un usuario específico (PUT).
        """
        url = f"{self.base_url}/bonita/API/bpm/userTask/{task_id}"
        # La API de Bonita espera un JSON con el ID del usuario a asignar
        payload = {"assigned_id": user_id}
        resp = self.session.put(url, json=payload)
        
        if resp.status_code not in [200, 201]:
            raise Exception(
                f"Error al asignar tarea {task_id} a user {user_id}: {resp.status_code} {resp.text}"
            )
        try:
            return resp.json()
        except requests.exceptions.JSONDecodeError:
            return True


    def search_activity_by_case(self, case_id: str):
        """
        Busca actividades/tareas pendientes (tasks) de un case específico (GET).
        Devuelve una lista de tareas.
        """
        url = f"{self.base_url}/bonita/API/bpm/task"
        params = {"f": f"caseId={case_id}"}
        resp = self.session.get(url, params=params)
        
        if resp.status_code != 200:
            raise Exception(f"Error buscando actividad para case {case_id}: {resp.status_code} {resp.text}")
        
        # Esto devuelve una lista de objetos de tarea
        return resp.json()

    def get_variable_by_case(self, case_id: str, variable_name: str):
        """
        Obtiene el valor de una variable de un case (GET).
        """
        url = f"{self.base_url}/bonita/API/bpm/caseVariable/{case_id}/{variable_name}"
        resp = self.session.get(url)
        
        if resp.status_code != 200:
            raise Exception(f"Error obteniendo variable {variable_name} de case {case_id}: {resp.status_code} {resp.text}")
        
        # Devuelve el objeto de la variable (ej: {"name": "...", "value": "...", "type": ...})
        return resp.json()

    # def get_variable_from_task(self, task_id: str, variable_name: str):
    #     """
    #     Obtiene una variable de un 'case' usando solo el 'task_id'.
    #     Esto realiza 2 llamadas API:
    #     1. GET /userTask/{task_id} (para obtener el 'caseId')
    #     2. GET /caseVariable/{caseId}/{variable_name} (para obtener la variable)
    #     """
    #     # 1. Obtener detalles de la tarea para encontrar el caseId
    #     task_url = f"{self.base_url}/bonita/API/bpm/userTask/{task_id}"
    #     task_resp = self.session.get(task_url)
    #     if task_resp.status_code != 200:
    #         raise Exception(f"Error obteniendo tarea {task_id}: {task_resp.status_code} {task_resp.text}")
        
    #     task_data = task_resp.json()
    #     case_id = task_data.get("caseId")
        
    #     if not case_id:
    #         raise Exception(f"No se pudo encontrar 'caseId' en la respuesta de la tarea {task_id}")

    #     # 2. Obtener la variable usando el caseId (reutiliza la función anterior)
    #     return self.get_variable_by_case(case_id, variable_name)
    
    def get_case_by_id(self, case_id: str):
        """
        Obtiene la información completa de un case por su ID (GET).
        """
        url = f"{self.base_url}/bonita/API/bpm/case/{case_id}"
        resp = self.session.get(url)
        
        if resp.status_code != 200:
            raise Exception(f"Error obteniendo case {case_id}: {resp.status_code} {resp.text}")
        
        # Devuelve el objeto completo del case
        return resp.json()
    
    def debug(msg, *args):
        print(f"[DEBUG] {msg}", *args)

    def wait_for_any_activity(bonita, case_id, timeout=10):
        def debug(msg, *args):
            print(f"[DEBUG] {msg}", *args)
        """Espera a que haya alguna actividad disponible."""
        debug("Esperando primera actividad...")
        start = time.time()
        while time.time() - start < timeout:
            acts = bonita.search_activity_by_case(case_id=case_id)
            debug("search_activity_by_case devolvió:", acts)
            if acts:
                return acts
            time.sleep(0.5)
        raise Exception("Timeout esperando primera actividad del proceso")

    def wait_for_ready_activity(bonita, case_id, previous_id=None, timeout=10):
        """
        Espera una actividad ready distinta de previous_id.
        """
        def debug(msg, *args):
            print(f"[DEBUG] {msg}", *args)
        debug(f"Esperando actividad READY (anterior id = {previous_id})...")
        start = time.time()
        while time.time() - start < timeout:
            acts = bonita.search_activity_by_case(case_id=case_id)
            debug("Actividades actuales:", acts)

            if not acts:
                time.sleep(0.5)
                continue

            act = acts[0]

            if act.get("state") == "ready" and act.get("id") != previous_id:
                debug("Actividad lista:", act)
                return act

            time.sleep(0.5)

        raise Exception("Timeout esperando actividad ready")