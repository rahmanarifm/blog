# Servers jekyll site on localhost
# takes screenshot using Firefox
# commits screenshot to new git repo
require "date"
require "json"
require "liquid"

d = DateTime.now
screenshot_name = d.strftime("%Y-%m-%d")
current_date = d.strftime("%d %B")
current_year = d.strftime("%Y")

puts "Loading jekyll site..."

pid = fork { exec("bundle exec jekyll s") }

sleep 3

puts "jekyll site loaded."

fork do
  exec(
    "/mnt/c/Program\\ Files/Firefox\\ Nightly/firefox.exe -headless --screenshot '..\\website.overlandandseas\\screenshots\\"
      .concat(screenshot_name, ".jpg' 'localhost:8080'")
  )
end

puts "Screenshot printed"

Process.kill(9, pid)
puts "server killed"

# load commit
commit = File.read(".git/refs/heads/master").split[0]

# load data from file
screenshots_file = File.read "screenshots.json"
screenshots_hash = JSON.parse screenshots_file

# append hash to data & save
screenshots_hash.push(
  {
    "name": screenshot_name,
    "date": current_date,
    "year": current_year,
    "homepagefilename": screenshot_name.concat(".jpg"),
    "postfileaname": screenshot_name.concat(".jpg"),
    "commit": commit
  }
)
File.write("screenshots.json", screenshots_hash.to_json)

# create home page
template_string = File.read "liquid-templates/index.liquid"
template = Liquid::Template.parse template_string
homepage = template.render("screenshots" => screenshots_hash)
File.write("../website.overlandandseas.com/index.html", homepage)

# create post pages
post_template_string = File.read "liquid-templates/post.liquid"
post_template = Liquid::Template.parse post_template_string
screenshot_hash.each do |shot|
  @post = post_template.render("screenshot" => shot)
  File.write("../website.overlandandseas.com/posts/".concat(shot.name, ".html"))
end
