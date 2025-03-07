import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

# Load the dataset
csv_file = "C:\\Users\\sprab\\Ml_lab\\APEAPCET2023LASTRANKDETAILS.csv"
df = pd.read_csv(csv_file)

# Replace non-numeric values in numeric columns with NaN
numeric_columns = ['COLLEGE FEE'] + [
    'OC_BOYS', 'OC_GIRLS', 'SC_BOYS', 'SC_GIRLS', 'BCA_BOYS', 'BCA_GIRLS',
    'BCB_BOYS', 'BCB_GIRLS', 'BCC_BOYS', 'BCC_GIRLS', 'BCD_BOYS', 'BCD_GIRLS',
    'BCE_BOYS', 'BCE_GIRLS', 'OC_EWS_BOYS', 'OC_EWS_GIRLS', 'ST_BOYS', 'ST_GIRLS'
]
for col in numeric_columns:
    df[col] = pd.to_numeric(df[col], errors='coerce')  # Convert non-numeric to NaN

# Fill missing values for numeric columns with 0
df.fillna(0, inplace=True)

# Encode categorical columns
label_encoders = {}
categorical_columns = ['INSTCODE', 'NAME OF THE INSTITUTION', 'INST_REG', 'BRANCH_CODE', 'TYPE']
for col in categorical_columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    label_encoders[col] = le

# Features and target preparation
category_columns = [
    'OC_BOYS', 'OC_GIRLS', 'SC_BOYS', 'SC_GIRLS', 'BCA_BOYS', 'BCA_GIRLS',
    'BCB_BOYS', 'BCB_GIRLS', 'BCC_BOYS', 'BCC_GIRLS', 'BCD_BOYS', 'BCD_GIRLS',
    'BCE_BOYS', 'BCE_GIRLS', 'OC_EWS_BOYS', 'OC_EWS_GIRLS', 'ST_BOYS', 'ST_GIRLS'
]
target_columns = ['INSTCODE', 'NAME OF THE INSTITUTION', 'COLLEGE FEE', 'TYPE']

# Features: category columns + branch_code + INST_REG
features = df[['BRANCH_CODE', 'INST_REG'] + category_columns]
targets = df[target_columns]

# Train the model
model = RandomForestRegressor(random_state=42, n_estimators=100)
model.fit(features, targets)

# Prediction function
def predict_institutions(person_rank, category_gender, branch_code, inst_reg):
    category_gender = category_gender.upper()
    branch_code = branch_code.upper()
    inst_reg = inst_reg.upper()
    
    if category_gender not in [col.upper() for col in category_columns]:
        raise ValueError(f"Invalid category_gender: {category_gender}. Must be one of {category_columns}")
    
    if branch_code not in label_encoders['BRANCH_CODE'].classes_:
        raise ValueError(f"Invalid branch_code: {branch_code}. Choose from {list(label_encoders['BRANCH_CODE'].classes_)}")
    
    if inst_reg not in label_encoders['INST_REG'].classes_:
        raise ValueError(f"Invalid INST_REG: {inst_reg}. Choose from {list(label_encoders['INST_REG'].classes_)}")

    # Encode branch_code and INST_REG
    branch_code_encoded = label_encoders['BRANCH_CODE'].transform([branch_code])[0]
    inst_reg_encoded = label_encoders['INST_REG'].transform([inst_reg])[0]

    # Prepare input data
    input_data = [branch_code_encoded, inst_reg_encoded] + [0] * len(category_columns)
    category_index = [col.upper() for col in category_columns].index(category_gender)
    input_data[category_index + 2] = person_rank  # Add person_rank to the correct category

    # Predict using the model
    predictions = model.predict([input_data])
    predictions = sorted(predictions, key=lambda x: x[2])[:2]  # Select top 2 colleges with min fee

    results = []
    for prediction in predictions:
        decoded_results = {
            'INSTCODE': label_encoders['INSTCODE'].inverse_transform([int(round(prediction[0]))])[0],
            'NAME OF THE INSTITUTION': label_encoders['NAME OF THE INSTITUTION'].inverse_transform([int(round(prediction[1]))])[0],
            'COLLEGE FEE': int(round(prediction[2])),
            'TYPE': label_encoders['TYPE'].inverse_transform([int(round(prediction[3]))])[0]
        }
        results.append(decoded_results)
    return results



# Predict and display results
try:
    results = predict_institutions(person_rank, category_gender, branch_code, inst_reg)
    print("Predicted Results:")
    for i, result in enumerate(results, 1):
        print(f"College {i}:")
        for key, value in result.items():
            print(f"  {key}: {value}")
except Exception as e:
    print(f"Error occurred: {e}")
