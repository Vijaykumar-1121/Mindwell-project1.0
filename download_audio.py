import urllib.request
import re
import os

urls = {
    'rain.mp3': 'https://pixabay.com/sound-effects/nature-gentle-rain-for-relaxation-and-sleep-337279/',
    'forest.mp3': 'https://pixabay.com/sound-effects/nature-forest-ambience-296528/',
    'ocean.mp3': 'https://pixabay.com/sound-effects/nature-ocean-waves-250310/'
}

os.makedirs('frontend/assets/audio', exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for filename, url in urls.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        # Pixabay usually puts the audio source in a meta tag or a script block or <audio> src
        # Let's search for an mp3 link that contains 'cdn.pixabay.com' or 'audio'
        # e.g., https://cdn.pixabay.com/audio/...
        match = re.search(r'https://cdn\.pixabay\.com/audio/[^"\'\s]+\.mp3', html)
        if match:
            mp3_url = match.group(0)
            print(f"Found {filename} -> {mp3_url}")
            
            # Download the mp3
            mp3_req = urllib.request.Request(mp3_url, headers=headers)
            mp3_data = urllib.request.urlopen(mp3_req).read()
            with open(f"frontend/assets/audio/{filename}", "wb") as f:
                f.write(mp3_data)
            print(f"Downloaded {filename}")
        else:
            print(f"Could not find mp3 link in {url}")
            
            # Fallback regex for other cdn patterns
            match2 = re.search(r'(https://[^"\'\s]+\.mp3)', html)
            if match2:
                print(f"Fallback matched: {match2.group(1)}")
                mp3_req = urllib.request.Request(match2.group(1), headers=headers)
                mp3_data = urllib.request.urlopen(mp3_req).read()
                with open(f"frontend/assets/audio/{filename}", "wb") as f:
                    f.write(mp3_data)
                print(f"Downloaded fallback {filename}")
            
    except Exception as e:
        print(f"Failed to process {filename}: {e}")
