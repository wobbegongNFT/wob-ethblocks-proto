from PIL import Image
import os

directory = r'../resource'

for filename in os.listdir(directory):
    if filename.endswith(".png"):
        fopen =  directory + '/' + filename;
        fsave =  directory + '/jpg/' + filename;
        fsave = fsave[0:len(fsave)-4] + '.jpg'
        im = Image.open(fopen)
        rgb_im = im.convert('RGB')
        rgb_im.save(fsave, quality = 80)
        print(fsave)