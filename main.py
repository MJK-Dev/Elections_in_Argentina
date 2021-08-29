from flask_bootstrap import Bootstrap
from flask import Flask, render_template, request, redirect, url_for, flash, send_file
from datetime import date
import pandas as pd
from pprint import pprint
from dhondt_calculator import DhondtCalculator
from arrange_data import ArrangeData
from data_input import DataInput
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = "pepe"
Bootstrap(app)

dc = DhondtCalculator()
ad = ArrangeData()
di = DataInput()


house_file = pd.read_csv("Diputados_Promedio_2017_2019_Final.csv")
house = pd.DataFrame(house_file)
provinces_house = di.csv_extractor(house)

senate_file = pd.read_csv("Senado_2021_Final.csv")
senate = pd.DataFrame(senate_file)
provinces_senate = di.csv_extractor(senate)

not_up_for_election_seats_file = pd.read_csv("Congreso_No_Renuevan.csv")
not_up_for_election_seats_DF= pd.DataFrame(not_up_for_election_seats_file)
not_up_for_election_seats = di.csv_seats_not_up_for_election_extractor(not_up_for_election_seats_DF)

page_help_file = pd.read_csv("Calculador_Ayuda.csv")
page_help_DF = pd.DataFrame(page_help_file)
page_help = di.csv_page_help_extractor(page_help_DF)
pprint(page_help)



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


final_results = dc.national_results(full_results_house)
final_results_senate = dc.national_results(full_results_senate)
final_display = ad.arrange_national_results(final_results)

@app.route("/", methods=["GET", "POST"])
def home():

    return render_template("index.html", national_results=final_results,
                           national_results_senate=final_results_senate,
                           provinces_results=full_results_house,
                           provinces_senate_results= full_results_senate,
                           not_up_for_election_seats = not_up_for_election_seats,
                           page_help=page_help)

@app.route("/results", methods=["GET", "POST"])
def calculate_results():

    return render_template("index.html")


@app.context_processor
def inject_today_date():
    return {'today_date': date.today().strftime("%Y")}

if __name__ == '__main__':
    app.run(debug=True)