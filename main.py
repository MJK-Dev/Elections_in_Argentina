
# All Imports-------------------------------------------------------------------------------------------

from flask_bootstrap import Bootstrap
from flask import Flask, render_template, request, redirect, url_for, flash, send_file, send_from_directory
from datetime import date
import pandas as pd
import os
from pprint import pprint

# Object imports------------------------------------------------------------------------------------------

from dhondt_calculator import DhondtCalculator
from arrange_data import ArrangeData
from data_input import DataInput


# App Config-------------------------------------------------------------------------------------------

app = Flask(__name__)
app.config['SECRET_KEY'] = "pepe"
Bootstrap(app)
app.config['UPLOAD_FOLDER'] = 'static/'


# Initializing objects coded for this page  (check their .py files---------------------------------------

dc = DhondtCalculator()
ad = ArrangeData()
di = DataInput()


# Reading csv files with Pandas and extracting info, returning a Data Frame-------------------------------

house_file = pd.read_csv("PASO_2021.csv")
house = pd.DataFrame(house_file)
provinces_house = di.csv_extractor(house)

senate_file = pd.read_csv("PASO_2021_Senado.csv")
senate = pd.DataFrame(senate_file)
provinces_senate = di.csv_extractor(senate)

not_up_for_election_seats_file = pd.read_csv("Congreso_No_Renuevan.csv")
not_up_for_election_seats_DF= pd.DataFrame(not_up_for_election_seats_file)
not_up_for_election_seats = di.csv_seats_not_up_for_election_extractor(not_up_for_election_seats_DF)

page_help_file = pd.read_csv("Calculador_Ayuda.csv")
page_help_DF = pd.DataFrame(page_help_file)
page_help = di.csv_page_help_extractor(page_help_DF)
pprint(page_help)


# Calculating full results for each province in each chamber (House and Senate)-------------------------------
# Values stored in lists (arrays)

full_results_house = []
for province in provinces_house:
   province_dict = dc.new_province(province)
   province_results = dc.calculate_distribution(province_dict["Seats"], province_dict["Results"])
   full_results_house.append([province_dict["Province"], province_results,province_dict["Weight"],int(province_dict["Senate_Seats"])])


full_results_senate = []
for province in provinces_senate:
   province_dict = dc.new_province(province)
   province_results = dc.calculate_distribution_senate(province_dict["Seats"], province_dict["Results"])
   full_results_senate.append([province_dict["Province"], province_results,province_dict["Weight"],int(province_dict["Senate_Seats"])])

# Calculating full national results for each chamber (House and Senate)-------------------------------

final_results = dc.national_results(full_results_house)
final_results_senate = dc.national_results(full_results_senate)



# Main route, sending all the processed data to the front-end-------------------------------

@app.route("/", methods=["GET", "POST"])
def home():

    return render_template("index.html", national_results=final_results,
                           national_results_senate=final_results_senate,
                           provinces_results=full_results_house,
                           provinces_senate_results= full_results_senate,
                           not_up_for_election_seats = not_up_for_election_seats,
                           page_help=page_help)


# Route for downloading the presentation------------------------------------------------------

@app.route('/download_presentation', methods=['GET','POST'])
def download_presentation():
    presentation = request.args.get("presentation")
    filename= str(presentation) + ".pdf"
    file = os.path.join(app.config['UPLOAD_FOLDER'] + "images/")
    return send_from_directory(directory=file, filename=filename)



# Sending present year and running the app------------------------------------------------------

@app.context_processor
def inject_today_date():
    return {'today_date': date.today().strftime("%Y")}

if __name__ == '__main__':
    app.run(debug=True)