from math import *
import random, time

noun_batch_1 = ['troll', 'wind', 'consiousness', 'tree', 'hill', 'gultch', 'splitter', 'monolith']
noun_batch_2 = ['branch', 'kraken', 'haggler', 'squire', 'hovel', 'village', 'stream', 'lizard']
adjectives = ['lunar', 'old', 'barren', 'vedic', 'weary', 'aquatic', 'solar', 'submerged', 'machine', 'acoustic']
enumaritive_nouns = ['level', 'basin', 'beam','wing', 'basin', 'echo', 'valley', 'durge', 'spire']


def name():
	v = random.random()
	i_n = round(v*999%(len(noun_batch_1)-1))
	i_n2 = round(v*988%(len(noun_batch_2)-1))
	i_a = round(v*977%(len(adjectives)-1))
	i_e = round(v*966%(len(enumaritive_nouns)-1))
	st = adjectives[i_a] + ' '
	st += noun_batch_1[i_n] + ' '
	st += noun_batch_2[i_n2] + ', '
	st += enumaritive_nouns[i_e] + ' '
	st += str(round(v,4))

	return st
