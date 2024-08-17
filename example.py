import streamlit as st
from st_oxview import oxview_from_file, oxview_from_text

if __name__ == "__main__":
    st.set_page_config(layout="wide")

    st.title("OxView Frame Component Examples")

    st.write('Pdb entry: 8BTZ')
    oxview_from_file(pdb='example_8btz.pdb', key='rna_nanostructure')

    st.markdown("## OxView from file upload")

    dat_text = None
    top_text = None
    txt_text = None
    pdb_text = None
    file_type = st.selectbox("Select a file type", ["PDB", "Oxdna (.dat, .top, .txt)"])

    if file_type == "Oxdna (.dat, .top, .txt)":
        col1, col2, col3 = st.columns(3) 
        with col1:
            dat = st.file_uploader("Upload a configuration file (.dat)", type=["dat"])
            if dat:
                dat_text = dat.getvalue()

        with col2:
            top = st.file_uploader("Upload a topology fil (.top)e", type=["top"])
            if top:
                top_text = top.getvalue()

        with col3:
            txt = st.file_uploader("Upload aforce file (.txt)", type=["txt"])
            if txt:
                txt_text = txt.getvalue()
    else:
        pdb = st.file_uploader("Upload a PDB file", type=["pdb"])
        if pdb:
            pdb_text = pdb.getvalue()

    col1, col2 = st.columns(2)
    with col1:
        width = st.slider("Width", min_value=50, max_value=2000, value=1000)
    with col2:
        height = st.slider("Height", min_value=50, max_value=1000, value=500)
        
    oxview_from_text(configuration=dat_text, topology=top_text, forces=txt_text, pdb=pdb_text, width=width, height=height, key='load_structure')
