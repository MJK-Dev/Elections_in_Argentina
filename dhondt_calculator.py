

class DhondtCalculator:
    """
    This class has 4 functions:

    1) new_province() returns a dictionary with the results of a given province

    2) calculate_distribution() calculates the D'Hondt distribution (seat allocation) for a given
    province in the House

    3) calculate_distribution_senate() calculates the seat distribution (2 for majority and 1 for minority)
    for a given province in the Senate

    4) national_results() calculate the sum of all seats for a given party nationally, both for House or for
    Senate
    """

    def __init__(self):
        self.number_seats = 1
        self.number_parties = 1
        self.final_results = []
        self.provinces_data = []


    def new_province(self,province_data):
        province_results = []
        for i in range (0, len(province_data["Party"])-3):
            party = province_data["Party"][i]
            votes = float(province_data["Votes"][i])
            allegiance = province_data["Allegiance"][i]
            province_results.append([party,allegiance,votes,0])
        new_dict = {
            "Province": province_data["Province"][0],
            "Seats": int(province_data["Seats"][0]),
            "Results": province_results,
            "Weight": province_data["Weight"][0],
            "Senate_Seats": province_data["Senate_Seats"][0]
        }
        self.provinces_data.append(new_dict)
        return self.provinces_data[-1]


    def calculate_distribution(self, seats, results):
        for i in range(0,seats):
            seat_won_by = None
            reminder = 0
            for party in results:

                votes = float(party[2] / (party[3] + 1))
                if votes > reminder:
                    reminder = votes
                    seat_won_by = results.index(party)
            results[seat_won_by][3] += 1
        return results

    def calculate_distribution_senate(self, seats, results):

        final_results = []
        for party in results:
            final_results.append(party)
        results.sort(key=lambda x: x[2], reverse=True)
        results[0][3] = 2
        results[1][3] = 1
        for party in final_results:
            if party[0] == results[0][0]:
                party[3] = 2
            if party[0] == results[1][0]:
                party[3] = 1
        return final_results



    def national_results(self, results):
        self.final_results = [["","",0,0]]
        for province in results:
            print(province)
            for i in range (0, len(province[1])):
               if [province[1][i][1],province[1][i][0],0,0] not in self.final_results:
                   self.final_results.append([province[1][i][1],province[1][i][0],0,0])
        self.final_results = self.final_results[1:]

        for party in self.final_results:
            for province in results:
                for i in range (0, len(province[1])):
                   if province[1][i][1] == party[0] and province[1][i][0] == party[1]:
                       party[2] += province[1][i][3]
                       party[3] += province[1][i][2]*province[2]

        return self.final_results





