#TODO: Add logger logs
import os, glob
import sys, requests, json, time

api_host = "http://localhost:5000"
auth_token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjQxMjQwODdlYTAzZjBlNjIyY2JhNiIsImlhdCI6MTY1NjY3MTE3OCwiZXhwIjoxNjg4MjA3MTc4fQ.Y2zvBCrgfrlW9rbobTpj9CaXZnBwC-EmjkdkMug40-g"


def post_compare_results(groupId, userId, image_list):
    data = {}
    data["userId"] = userId
    data["groupId"] = groupId
    data["results"]= image_list
    # for image in image_list:
    #     url = f"{image}"
    #     result_obj = {
    #         "url": url,
    #         "groupId": groupId,
    #         "userId": userId
    #     }
    #     data["results"].append(result_obj)
    total_results = len(data["results"])
    req_start = time.time()
    try:
        """ Making post request to App server """
        
        request_url = f"{api_host}/api/resultpost"
        # data = json.dumps(data, indent=4)
        # logger.debug("posting data: ", data)
        print(data)
        r = requests.post(request_url, json=data)
        
        # print(f"Api Response {r.text}", "FR")
        try:
            parsed_r = r.json()
            if not "status" in parsed_r:
                raise Exception("'status' not received in response")
            elif parsed_r["status"] != 201:
                print(f"Api Response for user: {userId} {r.text}","FR")
                
            else:
                print(f"{total_results} results posted for user: {userId}", "FR")
        except Exception as e:
            print(e)
            print(f"Failed to parse post_compare_results response {r.text}: {e}", "FR")
    except Exception as e:
        print(e)
        print(f"Failed to post results to App's server {e}", "FR")
    req_end = time.time()
    print(f"Posted {total_results} results in {round(req_end-req_start,5)} secs", "FR")


groupId = "631f2ecf776f1baacbd8f877"
userId = "631f2ecf776f1baacbd8f875"
allPicsEndpoint = f"{api_host}/api/app/pic/list-all/{groupId}?limit=5000"

resultList = []
image_list = []

for i in range(100):
    image = {
        "url": f"url-{i}"
    }
    result = {
        "url": image['url']
    }
    resultList.append(result)
    image_list.append(image['url'])
    
input('press enter to start posting')
post_compare_results(groupId, userId, image_list)