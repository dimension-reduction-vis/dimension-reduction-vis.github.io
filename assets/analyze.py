#%%
import pandas as pd
import json

#%%
df = pd.read_csv('Full Paper Analysis Data - Sheet1.csv')
df = df.dropna(how='all')
# %%
df = df[df['ReadBy']=='QW'].reset_index(drop=True)

jsonString = df[['Title', 'Subject Area', 'venue', 'year']].to_json(orient='records')
jsonString = jsonString.replace('Title', 'name')
jsonString = jsonString.replace('Subject Area', 'subject_area')
jsonPaper = json.loads(jsonString)

for paper in jsonPaper:
    paper['subject_area'] = paper['subject_area'].lower()
    paper['year']= str(int(paper['year']))

for idx, row in df.iterrows():
    jsonPaper[idx]['vis']=[]
    for colname in [
        'Projection - 3D',	
        'Projection - 2D',	
        'Projection - 2D+other',
        'Projection - 1D+other'
        ]:
      
        if (row[colname]=='Yes'):
            tag = colname.replace('Projection - ', '').replace('other', ''  ).lower()
            jsonPaper[idx]['vis'].append(tag)

    jsonPaper[idx]['dr']=[]
    for colname in [
        'Projection PCA',
        'Projection TSNE',	
        'Projection UMAP',
        'Projection Modification (is one of PCA, TSNE, UMAP, but modified)',
        'Other projection - Linear',	
        'Other projection - nonlinear'
        ]:
        if (row[colname]=='Yes'):
            tag = colname.replace('Projection ', '').lower()
            jsonPaper[idx]['dr'].append(tag)
    if  len(jsonPaper[idx]['dr'])==0:
            jsonPaper[idx]['dr'].append('other')

    jsonPaper[idx]['interpretation']=[]
    for colname in [
        'Interpretation - single points',
        'Interpretation - compare poitns',	
        'Interpretation - single clusters',	
        'Interpretation - compare clusters',	
        'Interpretation - global',	
        # 'Interpretation - plot vs. other attribute, i.e. heat map',	
        'Interpretation - outliers'
        ]:
        
        if row[colname]!='No' and type(row[colname])!=float:
            tag = colname.replace('Interpretation - ', '').lower()
            jsonPaper[idx]['interpretation'].append(tag)
    if  len(jsonPaper[idx]['interpretation'])==0:
        jsonPaper[idx]['interpretation'].append('none')
 

    jsonPaper[idx]['annotation']=[]
    tags = ['label', 'highlight', 'caption']
    for plot_tag_index, colname in enumerate( [
        'Plot annotated - textual labels',	
        'Plot annotated - highlighting used',	
        'Plot annotated - explained in captions'
        ]):
        if (row[colname]=='Yes'):     
            jsonPaper[idx]['annotation'].append(tags[plot_tag_index])
    if  len(jsonPaper[idx]['annotation'])==0:
        jsonPaper[idx]['annotation'].append('none')

    jsonPaper[idx]['ref'] = row['First author last name'] + jsonPaper[idx]['year'] + row['Title'].split(' ')[0]

    jsonPaper[idx]['style']=['ax']

    
# %%
# save json file 
with open('test.json', 'w') as outfile:
    json.dump(jsonPaper, outfile)
# %%

# open survey.json file
with open('survey.json') as json_file:
    survey = json.load(json_file)
    for idx, paper in enumerate(survey):
        for paper2 in jsonPaper:
            if paper['name']==paper2['name']:
                survey[idx] = paper2
                break

with open('survey.json', 'w') as outfile:
    json.dump(survey, outfile)
# %%
