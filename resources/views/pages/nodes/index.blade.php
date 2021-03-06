{{-- layout --}}
@extends('layouts.contentLayoutMaster')

{{-- page title --}}
@section('title', ' Nodes of '.$facility->name. ' Facilitiy')

    {{-- vendors styles --}}
@section('vendor-style')
    <link rel="stylesheet" type="text/css" href="{{ asset('vendors/data-tables/css/jquery.dataTables.min.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('vendors/data-tables/extensions/responsive/css/responsive.dataTables.min.css') }}">
    <link rel="stylesheet" type="text/css" href="{{asset('vendors/dropify/css/dropify.min.css')}}">
@endsection

{{-- page styles --}}
@section('page-style')
    <link rel="stylesheet" type="text/css" href="{{ asset('css/pages/page-nodes.css') }}">
@endsection

{{-- page content --}}
@section('content')
    @include('panels.alert')
    <!-- nodes list start -->
    <section class="nodes-list-wrapper section">
        @include('panels.search')
        <div class="col s12">
            <div class="nodes-list-table">
                <div class="card">
                    <div class="card-content">
                        <!-- datatable start -->
                        <div class="responsive-table">
                            <table id="nodes-list-datatable" class="highlight centered table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Id</th>
                                        <th>Name</th>
                                        <th>DevEUI</th>
                                        <th>Type</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($nodes as $node)
                                        <tr>
                                            <td></td>
                                            <td>{{ $node->id }}</td>
                                            <td><a href="{{ route('nodes.show', ['node' => $node->id]) }}">{{ $node->name }}</a></td>
                                            <td>{{ $node->dev_eui }}</td>
                                            <td>{{ App\Models\NodeType::find($node->node_type_id)->name }}</td>
                                            <td>
                                                @can('update', $node)
                                                    <a href="{{ route('nodes.show', ['node' => $node->id]) }}"><i class="material-icons">edit</i></a>
                                                @endcan 
                                            </td>
                                            <td>
                                                @can('delete', $node)
                                                    <a href="#"  onclick="confirmDelete('{{ route('nodes.destroy', ['node' => $node->id]) }}')"><i class="material-icons">delete</i></a>
                                                @endcan
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                        <!-- datatable ends -->
                    </div>
                </div>
            </div>
        </div>

        @cannot('update', $facility)
            @if ($facility->file != null)
                <a class="btn waves-effect waves-light mr-1 right" 
                    href="{{ route('nodes.fileDownload', ['facility' => $facility->id]) }}" 
                    type="submit">
                    <i class="material-icons left">file_download</i>LocationMap
                </a>
            @endif
        @endcannot
        @can('update', $facility)
        <div class="col s12 white">
            <div class="col s12">
                @if ($facility->file != null)
                    <a class="btn waves-effect waves-light right" 
                        href="{{ route('nodes.fileDownload', ['facility' => $facility->id]) }}" 
                        type="submit">
                        <i class="material-icons left">file_download</i>LocationMap
                    </a>
                @endif
            </div>
    
            <form method="POST" enctype="multipart/form-data" action="{{ route('nodes.fileUpload', ['facility' => $facility->id]) }}" >
                @csrf
                <ul class="collapsible collapsible-accordion">
                    <li class="">
                        <div class="collapsible-header" tabindex="0">
                            <i class="material-icons">
                                @if ($facility->file === null)
                                assignment_late
                                @else
                                assignment_turned_in
                                @endif
                            </i>
                            @if ($facility->file === null)
                                Add Location Map
                            @else
                                Change LocationMap
                            @endif
                        </div>
                        <div class="collapsible-body">
                            <input type="file" name="file" class="dropify" 
                                @if ($facility->file != null)
                                    data-default-file="{{$facility->file->name}}" 
                                @endif 
                                data-show-remove="false"
                                data-allowed-file-extensions="pdf"
                            />   
                            <div class="row">
                                @if ($facility->file != null)
                                    <a class="btn waves-effect waves-light mr-1 red lighten-2 right" onclick="confirmDelete('{{ route('nodes.fileRemove', ['facility' => $facility->id]) }}')" type="submit"><i class="material-icons">cancel</i></a>
                                @endif 
                                <button class="btn waves-effect waves-light mr-1 right" onclick="" type="submit"><i class="material-icons">file_upload</i></button>
                            </div>
                        </div> 
                    </li>  
                </ul>
            </form>
         </div>
         @endcan
      
        @can('create', App\Models\Node::class)
        <div class="col s12">
            <form method="POST" action="{{ route('nodes.store', ['facility' => $facility->id]) }}">
                @csrf
                <div id="inline-form" class="card card-default hoverable ">
                    <div class="card-content">
                        <h4 class="card-title">Create a new Node</h4>
                        <div class="row">
                            <div class="input-field col s12 m3">
                                <i class="material-icons prefix">create</i>
                                <input id="InputTitle" name="name" type="text" class="validate">
                                <label for="InputTitle">Name</label>
                            </div>
                            <div class="input-field col s12 m3">
                                <i class="material-icons prefix">fingerprint</i>
                                <input id="InputDevEui" name="dev_eui" type="text" class="validate">
                                <label for="InputDevEui">DevEUI</label>
                            </div>
                            <div class="input-field col s12 m3">
                                <select name="node_type_id">
                                    <option value="" disabled selected>Choose node type</option>
                                    <option value="1">Decentlab</option>
                                    <option value="2">Cayenne</option>
                                    <option value="3">Dragino</option>
                                    <option value="4">Zane</option>
                                </select>
                                <label>Node Type Select</label>
                            </div> 
                            <div class="input-field col s12 m3">
                                <select name="preset_id">
                                    <option value="" disabled selected>Choose preset</option>
                                    @foreach ($presets as $preset)
                                        <option value="{{$preset->id}}">{{$preset->name}}</option>    
                                    @endforeach
                                    <option value="0">none</option>    
                                </select>
                                <label>Preset Select</label>
                            </div>
                            <div class="input-field col s12">
                                <button class="btn waves-effect waves-light mr-1 col s12" type="submit">Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        @endcan
    </section>
    <!-- nodes list ends -->
@endsection

{{-- vendor scripts --}}
@section('vendor-script')
    <script src="{{ asset('vendors/data-tables/js/jquery.dataTables.min.js') }}"></script>
    <script src="{{ asset('vendors/data-tables/extensions/responsive/js/dataTables.responsive.min.js') }}"></script>
    <script src="{{ asset('vendors/sweetalert/sweetalert.min.js') }}"></script>
    <script src="{{asset('vendors/dropify/js/dropify.min.js')}}"></script>
@endsection

{{-- page script --}}
@section('page-script')
    <script src="{{ asset('js/scripts/page-nodes.js') }}"></script>
    <script src="{{ asset('js/scripts/ajax-delete.js') }}"></script>
    <script src="{{asset('js/scripts/form-file-uploads.js')}}"></script>
@endsection
