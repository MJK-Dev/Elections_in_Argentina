
# Calculating full results for each province in each chamber (House and Senate)-------------------------------

import pandas as pd

class DataInput:
    """
    This class has 3 extractors. All of them take a raw Pandas Dataframe as input

    1) csv_extractor takes the results for all provinces and returns new arranged Pandas Dataframes.
    Both used for Senate or House

    2) csv_seats_not_up_for_election_extractor takes the seats that are not up for election in both chambers,
    and returns a list with the arranged data

    3) csv_page_help_extractor takes the information needed to display all the 'help slides' for the main
    calculator
    """

    def __init__(self):
        pass

    def csv_extractor(self, elections):
        provinces = []
        for i in range(0, len(elections["Province"])):
            if not pd.isnull(elections["Province"][i]):
                data = {'Province': elections["Province"][i],
                        'Seats': int(elections["Seats"][i]),
                        'Party': [elections["Party"][i]],
                        'Allegiance': [elections["Allegiance"][i]],
                        'Votes': [elections["Votes"][i]],
                        'Weight':elections["Weight"][i],
                        'Senate_Seats':int(elections["Senate_Seats"][i])
                        }
                for x in range(i + 1, len(elections["Province"])):
                    if pd.isnull(elections["Province"][x]):
                        data["Party"].append([elections["Party"][x]][0])
                        data['Allegiance'].append([elections["Allegiance"][x]][0]),
                        data["Votes"].append([elections["Votes"][x]][0])
                    else:
                        break
                df = pd.DataFrame(data, columns=['Province', 'Seats', "Allegiance", "Party", "Votes", "Weight", "Senate_Seats"])
                provinces.append(df)
        return provinces

    def csv_seats_not_up_for_election_extractor(self, congress):
        branches = []
        for i in range(0, len(congress["Branch"])):
            if not pd.isnull(congress["Branch"][i]):
                data = {'Branch': congress["Branch"][i],
                        'Party': [congress["Party"][i]],
                        'Allegiance': [congress["Allegiance"][i]],
                        'Seats': [congress["Seats"][i]]
                       }
                for x in range(i + 1, len(congress["Branch"])):
                    if pd.isnull(congress["Branch"][x]):
                        data["Party"].append([congress["Party"][x]][0])
                        data['Allegiance'].append([congress["Allegiance"][x]][0]),
                        data["Seats"].append([congress["Seats"][x]][0])
                    else:
                        break
                df = pd.DataFrame(data, columns=['Branch', 'Party', "Allegiance", "Seats"])
                branches.append(df)
        all_branches = []
        for branch in branches:
            branch_composition = []
            for i in range(0, len(branch["Party"]) - 1):
                party = branch["Party"][i]
                allegiance = branch["Allegiance"][i]
                seats = int(branch["Seats"][i])
                branch_composition.append([party, allegiance, seats])
            all_branches.append([branch["Branch"][0],branch_composition])
        return all_branches

    def csv_page_help_extractor(self, page_help):
        slides =[]
        for i in range(0, len(page_help["Slide"])):
            data = {'Slide_X': int(page_help["Slide_X"][i]),
                    'Slide_Y': int(page_help["Slide_Y"][i]),
                    'H1': str(page_help["H1"][i]),
                    'H3': str(page_help["H3"][i]),
                    'Arrow_Show': int(page_help["Arrow_Show"][i]),
                    'Arrow_X': int(page_help["Arrow_X"][i]),
                    'Arrow_Y': int(page_help["Arrow_Y"][i]),
                    'Arrow_Degrees': int(page_help["Arrow_Degrees"][i]),
                    'Arrow_Clockwise': float(page_help["Arrow_Clockwise"][i]),
                    'Arrow_Anticlockwise': float(page_help["Arrow_Anticlockwise"][i]),
                    'Cover_Divs': list(map(int,(page_help["Cover_Divs"][i]).split(',')))
                    }
            slides.append([int(page_help["Slide"][i]),data])
        return slides