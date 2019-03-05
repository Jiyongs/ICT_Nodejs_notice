# **Node.js 게시판**

> Node.js를 기반으로 만든 게시판 홈페이지입니다.
-------------------------------------------------------------
## 1. Restful API 규칙
### 1) 계정 관리
① 회원가입
> - 파라미터 값을 받아 새로운 user를 생성합니다.

URL | Method | Parameter | Type | 의미
-- | -- | -- | -- | --
/users/ | POST | username | String | 아이디
|||password | String | 비밀번호
|  |  | name | String | 이름
|||email | String | 이메일
|||passwordConfirmation | String | 비밀번호 확인

② 로그인
> - 입력받은 파라미터 값이 가입된 정보와 일치하면 로그인합니다.

URL | Method | Parameter | Type | 의미
-- | -- | -- | -- | --
/login/ | POST | username | String | 아이디
 |  |password | String | 비밀번호

③ 로그아웃
> - 로그인 전 화면을 불러와 로그아웃 합니다.

URL | Method |
-- | -- |
/logout | GET |

④ 회원 조회
> - 모든 회원의 아이디를 출력하는 화면을 불러옵니다.
> - ② 로그인이 먼저 수행되어야 유효한 기능입니다.

URL | Method |
-- | -- |
/users | GET |

⑤ 내 정보 조회
> -  username이 현재 로그인한 {username}인 사용자의 가입 정보를 불러옵니다.
> - ② 로그인이 먼저 수행되어야 유효한 기능입니다.

URL | Method |
-- | -- |
/users/_{username}_| GET |

⑥ 내 정보 수정
> -  username이 {username}인 사용자의 가입 정보를 입력받은 값으로 수정합니다.
> - ② 로그인이 먼저 수행되어야 유효한 기능입니다.

URL | Method | Parameter | Type | 의미
-- | -- | -- | -- | --
/users/_{username}_/ | PUT | currentPassword | String | 현재 비밀번호
 |  |username| String | 아이디
||| name | String | 이름

### 2) 게시판 관리
① 글 생성
> - 파라미터 값을 받아 새로운 post를 생성합니다.
> - ② 로그인이 먼저 수행되어야 유효한 기능입니다.

URL | Method | Parameter | Type | 의미
-- | -- | -- | -- | --
/posts/ | POST | title| String | 글 제목
 |  |body| String | 글 내용

② 글 조회
> - 현재 게시된 모든 글을 작성 순으로 불러옵니다.
> - {id} 파라미터가 있으면, posts의 id가 {id}인 글을 불러옵니다.

URL | Method |
-- | -- |
/posts/_{:id}_ | GET |

③ 글 수정
> - posts의 id가 {id}인 글을 입력받은 값으로 수정합니다.
> - ② 로그인이 먼저 수행되어야 유효한 기능입니다.

URL | Method | Parameter | Type | 의미
-- | -- | -- | -- | --
/posts/_{id}_/ | PUT | title| String | 수정한 글 제목
 |  |body| String | 수정한 글 내용

④ 글 삭제
> - posts의 id가 {id}인 글을 삭제합니다.
> - ② 로그인이 먼저 수행되어야 유효한 기능입니다.

URL | Method |
-- | -- |
/posts/_{:id}_ | DELETE |
 
-------------------------------------------------------------

## 2. Input & Output Example
### 1) POST Example : 글 작성
> - Request
<pre> - Url : (POST) /posts/</pre>
<pre>- body
{
    "title" : "글 제목",
    "body" : "글 내용입니다."
}</pre>
> - Response

![image](https://user-images.githubusercontent.com/28644251/45789754-3b537980-bcbc-11e8-80f2-16ef4e7c0c7f.png)

: 입력한 내용으로 글이 등록된 후의 글 목록 화면을 보여줍니다.


### 2) GET Example : 게시글 조회
> - Request 1 : 모든 게시글 조회
<pre>- Url : (GET) /posts</pre>
<pre>- body : N/A</pre>

> - Response 1

![image](https://user-images.githubusercontent.com/28644251/45789087-f0843280-bcb8-11e8-833f-4a67654664d8.png)

: 게시된 모든 글의 목록을 보여줍니다.

> - Request 2 : 특정 게시글 조회
<pre>- Url : (GET) /posts/5b95ce19b7c43913ccdb7f6a</pre>
<pre>- body : N/A</pre>

> - Response 2

![image](https://user-images.githubusercontent.com/28644251/45789043-bdda3a00-bcb8-11e8-9751-ff22cbe62e67.png)

: 입력한 id에 해당하는 글을 조회합니다.


### 3) PUT Example : 게시글 수정
> - Request
<pre>- Url : (PUT) /posts/5b95ce19b7c43913ccdb7f6a</pre>
<pre>- body
{
	"title" : "글 수정 제목",
	"body" : "글 수정 내용입니다."
}</pre>

> - Response

![image](https://user-images.githubusercontent.com/28644251/45789288-e4e53b80-bcb9-11e8-8029-5ad1f672c2b5.png)

: 입력한 id에 해당하는 글을 body값으로 수정한 후의 화면을 보여줍니다.


### 4) DELETE Example : 게시글 삭제
> - Request
<pre>- Url : (DELETE) /posts/5b95ce19b7c43913ccdb7f6a</pre>
<pre>- body : N/A</pre>

> - Response

![image](https://user-images.githubusercontent.com/28644251/45789349-1bbb5180-bcba-11e8-8cd7-0ef0ceee35ae.png)

: 입력한 id에 해당하는 글이 삭제된 후의 글 목록을 보여줍니다.
