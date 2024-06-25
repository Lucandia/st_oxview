import streamlit as st
import os
from st_oxview import oxview_from_file


if __name__ == "__main__":
    st.set_page_config(layout="wide")
    st.title("OxView Frame Component")

    oxview_from_file(pdb='example.pdb', key='dna_duplex')

    st.markdown("## OxView from file upload")

    file_type = st.selectbox("Select a file type", ["Oxdna (.dat, .top, .txt)", "PDB"])

    dat = None
    top = None
    txt = None
    pdb = None

    if file_type == "Oxdna (.dat, .top, .txt)":
        col1, col2, col3 = st.columns(3)
        with col1:
            dat = st.file_uploader("Upload a configuration file (.dat)", type=["dat"])
            if dat:
                with open('static' + os.path.sep + dat.name, 'wb') as f:
                    f.write(dat.getvalue())
        with col2:
            top = st.file_uploader("Upload a topology fil (.top)e", type=["top"])
            if top:
                with open('static' + os.path.sep + top.name, 'wb') as f:
                    f.write(top.getvalue())
        with col3:
            txt = st.file_uploader("Upload aforce file (.txt)", type=["txt"])
            if txt:
                with open('static' + os.path.sep + txt.name, 'wb') as f:
                    f.write(txt.getvalue())

    elif file_type == "PDB":
        pdb = st.file_uploader("Upload a PDB file", type=["pdb"])
        if pdb:
            with open('static' + os.path.sep + pdb.name, 'wb') as f:
                f.write(pdb.getvalue())
                
    if dat and top:
        oxview_from_file(configuration=dat.name, topology=top.name, key = 'dat_top')
    elif dat and top and txt:
        oxview_from_file(configuration=dat.name, topology=top.name, forces=txt.name, key = 'dat_top_txt')
    elif pdb:
        oxview_from_file(pdb=pdb.name, key = 'pdb')
    else:
        oxview_from_file(key = 'empty')
