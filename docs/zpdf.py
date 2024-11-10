#!/usr/bin/env python
import os
from colabexts import utils as colabexts_utils
#------------------------------------------------------------------------------------
def use_spire():
    from spire.doc import *
    from spire.doc.common import *

    document = Document()
    document.LoadFromFile("99_Dockercheat.md")
    document.SaveToFile("ztest.pdf")
    document.Dispose()
    
def use_pandoc():
    os.system("pandoc -s -V geometry:margin=0.5in -o zall.pdf 01_*.md")
    os.system("open zall.pdf")

#------------------------------------------------------------------------------------
sysargs=None
def addargs( args=sys.argv[1:] ):
    global sysargs
    p = argparse.ArgumentParser(f"{os.path.basename(sys.argv[0])}:")
    p.add_argument('-m', '--method', type=str, required=False, default="", help="message")

    sysargs=p.parse_args(args)
    return sysargs
    
if __name__ == '__main__' and not colabexts_utils.inJupyter():
    args = addargs(sys.argv[1:])
    if (sysargs.method == ""):
        print("No method given")