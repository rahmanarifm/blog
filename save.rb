# Servers jekyll site on localhost
# takes screenshot using Firefox
# commits screenshot to new git repo
require 'date'
require 'json'

d = DateTime.now
screenshot_name = d.strftime("%Y-%m-%d")
current_date = d.strftime("%d %B")
current_year = d.strftime("%Y")

puts "Loading jekyll site..."

pid = fork { exec("bundle exec jekyll s") }

sleep 3

puts "jekyll site loaded."

fork { exec("/mnt/c/Program\\ Files/Firefox\\ Nightly/firefox.exe -headless --screenshot '..\\website.overlandandseas\\screenshots\\".concat(screenshot_name, ".jpg' 'https://overlandandseas.com'")) }

puts "Screenshot printed"

Process.kill(9, pid)
puts "server killed"

# load data from file
screenshots_file = File.read "screenshots.json"
screenshots_hash = JSON.parse file

screenshots_hash.push({
  "name": screenshot_name,
  "date": current_date,
  "year": current_year,
  "homepagefilename": screenshot_name.concat(".jpg"),
  "postfileaname": screenshot_name.concat(".jpg")
})
