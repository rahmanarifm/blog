# Servers jekyll site on localhost
# takes screenshot using Firefox
# commits screenshot to new git repo
require 'date'

d = DateTime.now
current_date = d.year.to_s.concat("-", d.month.to_s, "-", d.day.to_s)

puts "Loading jekyll site..."

pid = fork { exec("bundle exec jekyll s") }

sleep 3

puts "jekyll site loaded."

fork { exec("/mnt/c/Program\\ Files/Firefox\\ Nightly/firefox.exe -headless --screenshot '..\\website.overlandandseas\\screenshots\\".concat(current_date, ".jpg' 'https://overlandandseas.com'")) }

puts "Screenshot printed"

Process.kill(9, pid)
puts "server killed"
