ffmpeg -framerate 30 -pattern_type glob -i 'o-*.png' -vf 'scale=iw*4:-1' -sws_flags neighbor out.webm
