import requests
import os


END_POINT_URL = os.getenv("END_POINT_URL")
END_POINT_PASSWORD = os.getenv("END_POINT_PASSWORD")


def api_search(skill_name):
    reqUrl = f"{END_POINT_URL}/?q={skill_name}&limit=10"
    print("reqU ", reqUrl)

    headersList = {"Accept": "*/*", "Authorization": "Basic " + END_POINT_PASSWORD}

    response = requests.request("GET", reqUrl, headers=headersList)

    return response.json()


def api_ancestors(file_id):
    reqUrl = f"{END_POINT_URL}/ancestors/?path_addr={file_id}"

    headersList = {"Accept": "*/*", "Authorization": "Basic " + END_POINT_PASSWORD}

    response = requests.request("GET", reqUrl, headers=headersList)

    return response.json()


def api_child(file_id):
    reqUrl = f"{END_POINT_URL}/children/?path_addr={file_id}&limit=100"

    headersList = {"Accept": "*/*", "Authorization": "Basic " + END_POINT_PASSWORD}
    response = requests.request("GET", reqUrl, headers=headersList)

    return response.json()


def api_tree(file_id):
    reqUrl = f"{END_POINT_URL}/tree/?path_addr={file_id}&limit=100"

    headersList = {"Accept": "*/*", "Authorization": "Basic " + END_POINT_PASSWORD}

    response = requests.request("GET", reqUrl, headers=headersList)

    return response.json()


def api_popular_categories():
    reqUrl = f"{END_POINT_URL}/popular-categories/"
    headersList = {"Accept": "*/*", "Authorization": "Basic " + END_POINT_PASSWORD}

    response = requests.request("GET", reqUrl, headers=headersList)

    return response.json()


def limit_api_popular_categories():
    reqUrl = f"{END_POINT_URL}/dev-api/ISOT/popular-categories/"

    response = requests.request("GET", reqUrl)

    return response.json()


def limit_api_search(skill_name):
    reqUrl = f"{END_POINT_URL}/dev-api/ISOT/?q={skill_name}&limit=10"

    response = requests.request("GET", reqUrl)

    return response.json()


def limit_api_child(file_id):
    reqUrl = f"{END_POINT_URL}/dev-api/ISOT/children/?path_addr={file_id}&limit=100"

    response = requests.request("GET", reqUrl)

    return response.json()


def limit_api_tree(file_id):
    reqUrl = f"{END_POINT_URL}/dev-api/ISOT/tree/?path_addr={file_id}&limit=100"

    response = requests.request("GET", reqUrl)

    return response.json()


def get_files(skill_ids):
    reqUrl = f"{END_POINT_URL}/details/"
    headersList = {"Accept": "*/*", "Authorization": "Basic " + END_POINT_PASSWORD}
    response = requests.request(
        "GET",
        reqUrl,
        headers=headersList,
        params={"path_addrs": skill_ids},
    )
    if response.status_code != 200:
        return False

    return response.json()


def get_bulk_ancestors(file_ids):
    reqUrl = f"{END_POINT_URL}/bulk/ancestors/"
    headersList = {"Accept": "*/*", "Authorization": "Basic " + END_POINT_PASSWORD}
    response = requests.request(
        "GET",
        reqUrl,
        headers=headersList,
        params={"path_addrs": file_ids},
    )
    return response.json()
