# Uefa Competitions

An app to preview football team match-ups and competition structure in uefa competitions. 

User can set final results for domestic leagues and cups, and based on them the teams are allocated to uefa competitions according to real regulations.

User can also set scores for all matches in the uefa competitions, teams will advance based on the results. Draws are randomized and follow uefa regulations.

Beginning time is the start of 2024/25 season, and rankings include data up to 5 years prior.

## Running the app

- git clone the repo
- change database/uefa-BASE.db name to uefa.db
- cd server
  - npm run dev
- cd client
  - npm start
  - 
The app will open in localhost. All results that the user sets are saved in the database.
