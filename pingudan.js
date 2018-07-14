const SERVER_ADDRESS = "https://blokkytv.iptime.org";

var BAS = {
    Board_GetArticles: function(boardID, onStatusChange, onArticleListAvailable) {
        var request = new XMLHttpRequest();
        onStatusChange("서버로부터 자료를 가져오는 중입니다...");
        const url = SERVER_ADDRESS + "/Board/GetArticles?BoardID=" + boardID;
        console.log("URL: " + url);
        request.open("GET", url, true);
        request.onreadystatechange = function(event) {
            if(request.readyState == 4) {
                const text = request.responseText;
                switch(request.status) {
                    case 200:
                        onStatusChange("로드 완료. 정렬하는 중입니다...");
                        // 좋아요 수 기준으로 내림차순으로 정렬하여 배열에 넣음
                        var articles = JSON.parse(text).Articles;
                        var entryExists = {}
                        var array = [];
                        var lessThan = null;
                        while(true) {
                            var selectedArticle = null;
                            var maxLikes = -1;
                            var maxFound = false;
                            for(var articleString in articles) {
                                var articleAttributes = articles[articleString];
                                var max = false;
                                var likes = articleAttributes.Likes;
                                var articleObject = {"Article": articleString, "Likes": likes };
                                if(entryExists[articleString] != true) {
                                    if(likes > maxLikes) {
                                        maxLikes = articleAttributes.Likes;
                                        maxFound = true;
                                        selectedArticle = articleObject;
                                    }
                                }
                            }
                            if(maxFound == false) {
                                break;
                            }
                            entryExists[selectedArticle.Article] = true;
                            console.log(selectedArticle.Article);
                            array.push(selectedArticle);
                            lessThan = maxLikes;
                        }
                        onStatusChange("게시판으로부터 내용을 성공적으로 불러왔습니다.");
                        onArticleListAvailable(array);
                        break;
                    case 404:
                        onStatusChange("정의되지 않은 게시판입니다.");
                        break;
                    case 500:
                        onStatusChange("서버 오류");
                        alert(text);
                        break;
                }
            }
        }
        request.onerror = function(event) {
            onStatusChange("서버 접속 오류가 발생했습니다.");
        }
        request.send(null);
    },
    System_Status: function(onStatusChange) {
         var request = new XMLHttpRequest();
        onStatusChange("서버로부터 자료를 가져오는 중입니다...");
        const url = SERVER_ADDRESS + "/System/Status?HumanReadable=true";
        console.log("URL: " + url);
        request.open("GET", url, true);
        request.onreadystatechange = function(event) {
            if(request.readyState == 4) {
                onStatusChange(request.responseText);
            }
        }
        request.onerror = function(event) {
            onStatusChange("서버 오프라인");
        }
        request.send(null);
    }
}