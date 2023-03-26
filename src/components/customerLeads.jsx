import React, { Component } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import AltRouteRounded from '@mui/icons-material/AltRouteRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import { getApiData, postApiData } from '../services/httpService';
import { Checkbox, ListItemText } from '@mui/material';

class CustomerLeads extends Component {
    state = {
        userInfo:{
            first_name:"",
            user_name:"",
            email:"",
            last_name:"",
            role:"",
        },
        drawer:{
            open:false,
        },
        leadsCustomers:{
            rows:[],
            columns:[
                {
                    field:"first_name",
                    headerName:"First Name",
                    width:100,
                },
                {
                    field:"middle_name",
                    headerName:"Middle Name",
                    width:100,
                },
                {
                    field:"last_name",
                    headerName:"Last Name",
                    width:100,
                },
                {
                    field:"phone_number",
                    headerName:"Phone Number",
                    width:120,
                },
                {
                    field:"location",
                    headerName:"Location",
                    width:100,
                },
                {
                    field:"gender",
                    headerName:"Gender",
                    width:80,
                },
                {
                    field:"date_created",
                    headerName:"Date Created",
                    width:170,
                    type: 'dateTime',
                    valueGetter: ({ value }) => value && new Date(value),
                },
                {
                    field:"annual_earning",
                    headerName:"Annual Earning",
                    width:120,
                },
                {
                    field:"date",
                    headerName:"Date Converted",
                    width:120,
                    type: 'date',
                    valueGetter: ({ value }) => value && new Date(value),
                },
                {
                    field:"actions",
                    headerName:"Actions",
                    width:120,
                    type: 'actions',
                    getActions: ({ row }) => [
                        !row.customer && this.state.userInfo.role === "customer-creator" ?
                        <GridActionsCellItem
                            icon={
                                <Tooltip title="Convert this lead to customer" placement="top">
                                    <AltRouteRounded sx={{ width:"1.2em", height:"1.2em", color:"#530dcc" }} />
                                </Tooltip>
                            }
                            label="Convert Lead to customer"
                            onClick={()=>this.handleLeadEdit(row)}
                        />
                        : this.state.userInfo.role === "customer-creator" ?
                        <GridActionsCellItem
                            icon={
                                <Tooltip title="Already converted to a customer!" placement="top">
                                    <VerifiedRoundedIcon sx={{ width:"1.2em", height:"1.2em", color:"green" }} />
                                </Tooltip>
                            }
                            label="Already a customer!"
                            onClick={()=>{console.log("Converting Lead to customer")}}
                        />
                        :
                        <></>,
                        row.customer || this.state.userInfo.role !== "customer-creator" ?
                        <GridActionsCellItem
                            icon={
                                <Tooltip title="Edit details" placement="top">
                                    <EditRounded sx={{ width:"1em", height:"1em", color:"#530dcc" }} />
                                </Tooltip>
                            }
                            label="Edit details"
                            onClick={()=>this.handleLeadEdit(row)}
                        />
                        :
                        <></>
                    ],
                }
            ]
        },
        leadForm:{
            id:0,
            first_name:"",
            middle_name:"",
            last_name:"",
            phone_number:"",
            location:"",
            gender:"",
        },
        leadConversionForm:{
            id:0,
            lead_id:0,
            annual_earning:0,
            products_of_interest:[]
        },
        products:[]
    }
    async componentDidMount(){
        let {userInfo,leadsCustomers, products } = this.state, customer_details={}, leadsDetails = [];
        try {
            const { data, status }= await getApiData('api/user/');
            console.log(data);
            if (status === 200){
                userInfo.first_name=data.user_data.first_name;
                userInfo.last_name=data.user_data.last_name;
                userInfo.user_name=data.user_data.username;
                userInfo.email=data.user_data.email;
                userInfo.role=data.user_data.role;
                products = data.product_data;
                if (data.user_data.role === "customer-creator"){
                    for (let lead of data.leads_data){
                        if (lead.customer){
                            customer_details = data.user_data.customers.find(one => one.lead.id === lead.id);
                            leadsDetails.push({
                                ...lead,
                                annual_earning:customer_details.annual_earning,
                                created_by:customer_details.created_by,
                                date:customer_details.date,
                                customer_id:customer_details.id,
                                photo:customer_details.photo,
                                products_of_interest:customer_details.products_of_interest.map(one => one.id),
                            });
                        } else {
                            leadsDetails.push({
                                ...lead,
                                annual_earning:"Pending...",
                                created_by:null,
                                date:null,
                                customer_id:null,
                                photo:null,
                                products_of_interest:[],
                            });
                        }
                    }
                    leadsCustomers.rows = leadsDetails;
                }
                else
                    leadsCustomers.rows=data.user_data.leads.filter(one => !one.customer);
                this.setState({ userInfo, leadsCustomers, products });
            }
        } catch (error) {
            this.props.handleOpenToast(error, 'error')
        }
    }
    handleChange=({ target })=>{
        let { leadForm } = this.state;
        leadForm[target.name] = target.value;
        this.setState({ leadForm });
    }
    handleConversionChange=({ target })=>{
        let { leadConversionForm } = this.state;
        leadConversionForm[target.name] = target.value;
        if(target.name === 'annual_earning')
            leadConversionForm.products_of_interest = [];
        this.setState({ leadConversionForm });
    }
    handleLeadSubmit = async (event) => {
        event.preventDefault();
        let { leadForm, leadsCustomers, drawer } = this.state;
        try {
            const { data, status } = await postApiData("api/lead_conversion/", leadForm);
            console.log(data)
            if(status === 200){
                leadsCustomers.rows=data.leads_data.filter(one => !one.customer);
                drawer.open = false;
                leadForm = {
                    id:0,
                    first_name:"",
                    middle_name:"",
                    last_name:"",
                    phone_number:"",
                    location:"",
                    gender:"",
                }
                this.setState({ leadsCustomers, leadForm, drawer });
                this.props.handleOpenToast(data.message, "success");
            } else this.props.handleOpenToast(`Error: ${data.message}`, "error");
        } catch (error) {
            this.props.handleOpenToast(`Error: ${error}`, "error");
        }
    }
    handleCustomerSubmit = async (event) => {
        event.preventDefault();
        let { leadConversionForm, leadsCustomers, drawer } = this.state, leadsDetails = [], customer_details={};
        try {
            const { data, status } = await postApiData("api/customer_creation/", leadConversionForm);
            console.log(data)
            if(status === 200){
                for (let lead of data.leads_data){
                    if (lead.customer){
                        customer_details = data.customers_data.find(one => one.lead.id === lead.id);
                        leadsDetails.push({
                            ...lead,
                            annual_earning:customer_details.annual_earning,
                            created_by:customer_details.created_by,
                            date:customer_details.date,
                            customer_id:customer_details.id,
                            photo:customer_details.photo,
                            products_of_interest:customer_details.products_of_interest,
                        });
                    } else {
                        leadsDetails.push({
                            ...lead,
                            annual_earning:"Pending...",
                            created_by:null,
                            date:null,
                            customer_id:null,
                            photo:null,
                            products_of_interest:[],
                        });
                    }
                }
                leadsCustomers.rows = leadsDetails;
                drawer.open = false;
                this.setState({ leadsCustomers, leadConversionForm, drawer });
                this.props.handleOpenToast(data.message, "success");
            } else this.props.handleOpenToast(`Error: ${data.message}`, "error");
        } catch (error) {
            this.props.handleOpenToast(`Error: ${error}`, "error");
        }
    }
    handleToggleDrawer = openDrawer => {
        let { drawer } = this.state;
        drawer.open = openDrawer;
        this.setState({ drawer });
    }
    handleLeadEdit = (row) => {
        let { leadForm, drawer, userInfo, leadConversionForm } = this.state;
        leadForm = {
            id:row.id,
            first_name:row.first_name,
            middle_name:row.middle_name,
            last_name:row.last_name,
            phone_number:row.phone_number,
            location:row.location,
            gender:row.gender,
        };
        if(userInfo.role === "customer-creator")
            if (row.customer)
                leadConversionForm = {
                    id: row.customer,
                    lead_id: row.id,
                    annual_earning: row.annual_earning,
                    products_of_interest: row.products_of_interest
                };
            else
                leadConversionForm = {
                    id: 0,
                    lead_id: row.id,
                    annual_earning: 0,
                    products_of_interest: []
                };
        drawer.open = true;
        this.setState({ leadForm, drawer, leadConversionForm });
    }
    render() {
        const { userInfo, leadsCustomers, drawer, leadForm, leadConversionForm, products }=this.state;
        const leadFormFields = [
            { name:"first_name", label:"First Name", type:"text" },
            { name:"middle_name", label:"Middle Name", type:"text" },
            { name:"last_name", label:"Last Name", type:"text" },
            { name:"phone_number", label:"Phone Number", type:"text" },
            { name:"location", label:"Location", type:"text" },
            {
                name:"gender",
                label:"Gender",
                type:"select",
                options: [
                    { value:'F', label: "Female"},
                    { value:'M', label: "Male"}
                ]
            },
        ];
        let productOptions = [];
        if (leadConversionForm.annual_earning >= 30000)
            productOptions = products;
        else if (leadConversionForm.annual_earning >= 20000)
            productOptions = products.filter(one => one.id !== 3);
        else if (leadConversionForm.annual_earning >= 10000)
            productOptions = products.filter(one => one.id !== 3 && one.id !== 2);
        const leadConversionFields = [
            { name:"annual_earning", label:"Annual Earning", type:"number" },
            {
                name:"products_of_interest",
                label:"Products of Interest",
                type:"select",
                options: productOptions,
            }
        ];
        return (
        <React.Fragment>
            <Drawer
                anchor={"right"}
                open={drawer.open}
                onClose={()=>this.handleToggleDrawer(false)}
            >
                <Box component={"form"}
                    sx={{
                        width:360,
                        display:"flex",
                        justifyContent:"center",
                        alignItems:"center",
                        flexDirection:"column",
                        py:4,
                        px:2,
                    }}
                    onSubmit={userInfo.role === "lead-creator" ? this.handleLeadSubmit : this.handleCustomerSubmit}
                >
                    <Typography gutterBottom variant='h5' component={"h5"}>
                        {userInfo.role === "lead-creator" ? "Lead Form" : "Customer Form"}
                    </Typography>
                    {leadFormFields.map((field, index)=>
                    <React.Fragment key={index}>
                        {field.type === "text" || field.type === "number" ?
                        <TextField fullWidth
                            type={field.type}
                            name={field.name}
                            label={field.label}
                            size="small"
                            sx={{
                                mb:2
                            }}
                            value={leadForm[field.name]}
                            onChange={this.handleChange}
                            required
                            disabled={userInfo.role === "customer-creator"}
                        />
                        : field.type === 'select' ?
                        <FormControl fullWidth sx={{ mb:2 }} size="small">
                            <InputLabel id={`id-${field.name}-label`}>{field.label}</InputLabel>
                            <Select labelId={`id-${field.name}-label`}
                                id={`id-${field.name}`}
                                name={field.name}
                                value={leadForm[field.name]}
                                label={field.label}
                                onChange={this.handleChange}
                                disabled={userInfo.role === "customer-creator"}
                            >
                                {field.options.map((option, index) =>
                                    <MenuItem value={option.value} key={index}>{option.label}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        :
                        <></>
                        }
                    </React.Fragment>
                    )}
                    {userInfo.role === "customer-creator" ?
                        <React.Fragment>
                            <Divider variant='middle' sx={{ mb:2, width:"90%" }} />
                            {leadConversionFields.map((field, index)=>
                            <React.Fragment key={index}>
                            {field.type === "text" || field.type === "number" ?
                                <TextField fullWidth
                                    name={field.name}
                                    type={field.type}
                                    label={field.label}
                                    size="small"
                                    sx={{ mb:2 }}
                                    value={leadConversionForm[field.name]}
                                    onChange={this.handleConversionChange}
                                    required
                                />
                                : field.type === 'select' ?
                                <FormControl fullWidth sx={{ mb:2 }} size="small">
                                    <InputLabel id={`id-${field.name}-label`}>{field.label}</InputLabel>
                                    <Select labelId={`id-${field.name}-label`}
                                        id={`id-${field.name}`}
                                        name={field.name}
                                        value={leadConversionForm[field.name]}
                                        label={field.label}
                                        onChange={this.handleConversionChange}
                                        multiple
                                        renderValue={(selected) => { return selected.map(one => field.options.find(two => two.id === one).name).join(', ')}}
                                    >
                                        {field.options.map((option, index) =>
                                            <MenuItem value={option.id} key={index}>
                                                <Checkbox checked={leadConversionForm[field.name].indexOf(option.id) > -1} />
                                                <ListItemText primary={option.name} />
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                :
                                <></>
                            }
                            </React.Fragment>
                            )}
                        </React.Fragment>
                    :
                        <></>
                    }
                    <Button type="submit" variant='contained' color="success" sx={{ textTransform:"none" }}>Submit</Button>
                </Box>
            </Drawer>
            <Container maxWidth="lg" sx={{ mt:5}}>
                <Grid container spacing={1} >
                    <Grid item md={12} sx={{ mb:3 }}>
                        <Typography gutterBottom variant='h5' component={"h5"}>
                            Welcome {userInfo.user_name}
                        </Typography>
                    </Grid>
                    {userInfo.role === "lead-creator" ?
                    <Grid item md={12} sx={{ mb:3 }}>
                        <Button variant="contained" sx={{ textTransform:"none" }} onClick={()=>this.handleToggleDrawer(true)} >Create Lead</Button>
                    </Grid>
                    :
                    null
                    }
                    <Grid item md={12}>
                       <DataGrid autoHeight
                            rows={leadsCustomers.rows}
                            columns={
                                userInfo.role === "lead-creator" ?
                                leadsCustomers.columns.filter(one => one.field !== "annual_earning" && one.field !== "date")
                                :
                                leadsCustomers.columns
                            }
                        />
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
        );
    }
}

export default CustomerLeads;