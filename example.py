import streamlit as st
from st_oxview import oxview_from_text, oxview_from_file


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
                dat = dat.getvalue()
        with col2:
            top = st.file_uploader("Upload a topology fil (.top)e", type=["top"])
            if top:
                top = top.getvalue()
        with col3:
            txt = st.file_uploader("Upload aforce file (.txt)", type=["txt"])
            if txt:
                txt = txt.getvalue()
    elif file_type == "PDB":
        pdb = st.file_uploader("Upload a PDB file", type=["pdb"])
        if pdb:
            pdb = pdb.getvalue()

    oxview_from_text(configuration=dat, topology=top, forces=txt, pdb=pdb, key='custom_upload')