import pandas as pd
import xlrd
import json

CONST_dict = []
CONST_K1 = []
previous_k1 = ''
Data = {}

JSON_data = []


df = pd.read_excel('source\紅樓夢人物關係20190523.xlsx').fillna('nan')
# print(df.iloc[1].values[0])
# print(df.index.values)
# print(df)

for i in df.index.values:
    row_data = df.ix[i, ['姓名', '關係', '關係人']].values

    if row_data[1] == 'nan' or row_data[2] == 'nan':
        continue
    else :
        CONST_K1.append(row_data[0])
        if row_data[0] in Data :
            Data[row_data[0]]['kg2'].append({
                "k2" : row_data[2],
                "type" : [
                    row_data[1]
                ]
            })
        else : 
            Data[row_data[0]] = {
                "k1" : row_data[0], 
                "kg2" : [
                    {
                        "k2" : row_data[2],
                        "type" : [
                            row_data[1]
                        ]
                    }
                ]
            }
        
CONST_K1 = list(dict.fromkeys(CONST_K1))
# print(Data)

for key, value in Data.items():
    JSON_data.append(value)

print(JSON_data)