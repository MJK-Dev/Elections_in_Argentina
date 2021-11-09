

class ArrangeData:

    """
    To arrange data for a specific display.
    Not in use
    """

    def __init__(self):
        self.national_results = [["","",""]]

    def arrange_national_results(self, results):
        for option in results:
            if [option[0],0,0] not in self.national_results:
                self.national_results.append([option[0],0,0])
        self.national_results = self.national_results[1:]
        for allegiance in self.national_results:
            for option in results:
                if option[0] == allegiance[0]:
                    allegiance[1] += option[2]
        return self.national_results
