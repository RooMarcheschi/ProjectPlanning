from bonita_client import BonitaClient
import time

def get_bonita_client(username: str = "walter.bates", password: str = "123456"):
    bonita = BonitaClient(
        # http://host.docker.internal:8080 o "http://localhost:8080"
        base_url="http://host.docker.internal:8080",
        username=username,
        password=password,
    )
    return bonita

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
