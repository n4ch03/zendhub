# zendhub

## Zendesk webtask

```
wt create web-tasks/zendhub-wt.js --name  zendhub -s ZENDESK_USERNAME=USERNAME -s ZENDESK_PASSWORD=PASSWORD
-s ZENDESK_DOMAIN=DOMAIN -s ZENDESK_GITHUB_FIELD_ID=GITHUB_ID -s GITHUB_USERNAME=USERNAME -s GITHUB_PASSWORD=PASSWORD
-s GITHUB_REPO=REPO
```

## Github webtask
```
wt create web-tasks/zendhub-github-webhook-wt.js --name  zendhub-gh -s ZENDESK_USERNAME=USERNAME
-s ZENDESK_PASSWORD=PASSWORD -s ZENDESK_DOMAIN=DOMAIN
```
