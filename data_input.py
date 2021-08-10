import pandas as pd

class DataInput:
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