# Load necessary libraries
library(rtweet)   # For accessing Twitter API
library(tweetrmd) # For creating screenshots of tweets

# Function to create a Twitter OAuth token
lasttweet_token <- function() {
  create_token(
    app = "banner.gif",  # Replace 'YourAppName' with the actual app name you registered on Twitter
    consumer_key = Sys.getenv("CONSUMER_KEY"),
    consumer_secret = Sys.getenv("CONSUMER_SECRET"),
    access_token = Sys.getenv("ACCESS_TOKEN"),
    access_secret = Sys.getenv("ACCESS_SECRET"),
    set_renv = FALSE
  )
}

# Define the Twitter handle and fetch the latest tweet
handle <- "lamkaichim"  # Replace 'YourTwitterHandle' with the actual Twitter handle you want to track
recent_tweets <- get_timeline(handle, n = 1, token = lasttweet_token())

# Verify if tweets are fetched successfully
if (length(recent_tweets$status_id) > 0) {
  # Prepare the filename for the screenshot
  tmpimg <- "tweet.png"

  # Generate the screenshot of the tweet
  tweet_screenshot(
    tweet_url(handle, recent_tweets$status_id[1]),
    scale = 5,
    maxwidth = 600,
    theme = "light",
    file = tmpimg
  )
} else {
  cat("No tweets fetched. Check handle or connectivity.\n")
}
