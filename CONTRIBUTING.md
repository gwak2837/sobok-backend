# Contributing to this repository

> [Git Flow (atlassian.com)](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

> [GitHub Flow (guides.github.com)](https://guides.github.com/introduction/flow/)

## Getting started

개발을 시작하기 전에

- 프로젝트를 개발하기 위해 필요한 [개발 환경](README.md)을 확인합니다.
- [Code of conduct](CODE_OF_CONDUCT.md)를 읽어보셨나요?
- 프로젝트에 존재하는 [이슈](https://github.com/teamsindy20/sobok-backend/issues)를 확인합니다.

## Git Flow

본 프로젝트는 프로젝트 참여 인원이 적기 때문에 main, develop, feature 브랜치 위주로 이용합니다.

## Issue 등록

다른 사람에게 자신의 진행 상황을 공유하기 위해 GitHub에 자신이 할 일을 이슈로 등록합니다.

이슈 등록 시 [이슈 템플릿](https://github.com/teamsindy20/sobok-backend/issues/new/choose)을 이용합니다. 이슈 제목은 제목을 보고 대략적으로 내용을 알 수 있을 정도로 한글 또는 영어로 작성합니다. 그리고 오른쪽의 Assignee는 자신으로, Labels과 Projects는 적절하게 선택하고 이슈 내용은 어떤 기능을 개발할 것인지 제목보다 상세하게 적습니다. 이슈 내용에 내용 이해를 돕는 이미지·영상을 첨부하면 더 좋습니다.

## Branch 생성

생성한 이슈를 기반으로 develop 브랜치에서 자신이 작업할 feature 브랜치를 아래와 같은 이름으로 생성합니다.

```
feature/#이슈번호/설명
fix/#이슈번호/설명
```

브랜치를 생성하기 전엔 다른 사람의 커밋을 항상 최신으로 유지하기 위해 `git pull, yarn` 등을 실행합니다. 만약 이슈 번호가 `#1`이면 브랜치 이름은 `feature/#1/description-of-feature`와 같은 형식으로 짓고, 설명 부분은 [Kebob Case](https://en.wiktionary.org/wiki/kebab_case)를 사용해서 영어로 간단히 짓습니다. 나중에 브랜치 단위로 코드 리뷰가 이뤄지므로 브랜치 단위는 코드 변경 사항이 최소 (+100)줄, 최대 (+500)줄이 되도록 설정하는 것을 권장합니다.

## Pull Request 생성

팀원에게 자신의 진행 상황을 공유하기 위해 GitHub에 feature 브랜치를 develop 브랜치로 병합하는 PR을 `Draft`로 생성합니다.

PR 제목은 병합하려는 브랜치 이름으로 합니다. 예를 들어 `feature/#1/project-setting` 브랜치를 develop 브랜치로 병합하는 PR의 제목은 `Feature/#1/project setting` 형식으로 짓습니다.

이슈와 마찬가지로 PR를 등록할 때 오른쪽의 Assignee는 자신으로 설정하고, Labels와 Projects는 적절하게 선택합니다.

## 코드 작성 및 커밋

feature 브랜치에서 개발을 진행하고 자유롭게 커밋합니다.

모든 커밋 메시지 제목은 영어로 작성하고 PR 번호를 인용할 수 있습니다. 커밋 메시지 설명은 한국말로 덧붙이거나 작성하지 않아도 됩니다. 커밋 메시지 제목은 목적에 따라 아래와 같이 현재형 동사를 사용하고 마침표는 찍지 않습니다.

- 기능 개발 : `Add feature of`
- 버그 수정 : `Fix error of`
- CSS 수정 : `Update style of`
- 코드 리팩토링 : `Refactor`, `Clean`
- 파일 추가 : `Upload`, `Create`
- 파일 수정 : `Move`, `Rename`
- 파일 삭제 : `Remove`, `Delete`
- 문서 수정 : `Update docs`
- 테스트 코드: `Test`
- 커밋 되돌리기 : `Revert`
- Update, Modify 의미 차이?
- Remove, Delete 의미 차이?

커밋할 때 작업한 모든 내용을 한 커밋에 몰아 넣지 말고, 다른 사람도 잘 알아볼 수 있도록 의미 있게 여러 개로 구분해서 커밋합니다.

## Code Review 요청

개발이 완료되면 PR 페이지 아래 쪽의 "Ready for Review" 버튼을 클릭하고 다른 사람에게 코드 리뷰를 요청합니다. 이때 PR 내용에 자신이 무엇을 작업했는지 글이나 사진으로 언급해주면 좋습니다.

코드 리뷰를 요청하기 전에 PR의 충돌 사항을 수정합니다. 코드 리뷰를 요청하는 코드 단위는 최소 (+100)줄, 최대 (+500)줄을 권장합니다. 코드 리뷰 후 모든 피드백 사항이 PR에 반영되면 PR이 승인됩니다.

이 프로젝트에선 코드 리뷰 승인을 받은 PR에 새로운 커밋이 생기면 기존 코드 리뷰 승인이 사라지니 유의합니다.

## Code Review

어떤 PR은 이전 PR에 의존하고(이전 PR 커밋을 포함하고) 있을 수 있어서, 코드 리뷰는 번호가 낮은 PR 부터 하는 것을 권장합니다.

#### 방법

1. Pull Request 들어가기
2. File changed
3. 코드 리뷰 하기 (의견, 질문, 제안 등)
4. Review changes
5. Approve
6. Submit review

#### 기능 동작

기능이 잘 동작하는지 확인합니다.

#### 코드 품질

코드 품질이나 코딩 컨벤션에 대해서 확인합니다. 이때 코드 품질이 안 좋은 이유와 참고할 수 있는 사이트를 같이 언급하는 것을 권장합니다.

## FAQ

#### Q. 코드 리뷰가 안 끝났는데 다른 작업을 시작하고 싶어요. 이럴 땐 어떻게 하나요?

develop 브랜치 대신 코드 리뷰가 필요한 feature 브랜치(자신이 작업한 브랜치)를 기반으로 새로운 feature 브랜치를 위 1~3번 과정대로 생성한 후 개발을 진행합니다.

#### Q. 다른 사람이 작업한 내용의 코드 리뷰가 아직 끝나지 않아 develop에 반영되지 않았는데 제 브랜치로 반영하고 싶으면 어떻게 하나요?

원래는 코드 리뷰가 끝나고 develop에 반영된 내용을 자신의 브랜치로 병합하는 것을 권장하지만, 이 경우 파일 충돌에 유의해야 합니다.
